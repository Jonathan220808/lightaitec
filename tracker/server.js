/**
 * lightaitec.com tracker
 * Lightweight event tracking API + stats endpoint.
 *
 * Endpoints:
 *   POST /api/track   - record an event from the browser
 *   GET  /api/stats   - return aggregated stats (requires ?key=<DASHBOARD_KEY>)
 *
 * Reverse-proxied under /api/ by Nginx on the host.
 * Listens on 127.0.0.1:3001 only (not exposed publicly).
 */

const path = require('path');
const express = require('express');
const Database = require('better-sqlite3');
const geoip = require('geoip-lite');

const PORT = 3001;
const HOST = '127.0.0.1';

// Dashboard access key. Override in production via env var DASHBOARD_KEY.
const DASHBOARD_KEY = process.env.DASHBOARD_KEY || 'change-me-please';

// SQLite database file. Lives next to this script.
const DB_PATH = path.join(__dirname, 'tracker.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    character_id TEXT,
    character_name TEXT,
    gender TEXT,
    source TEXT,
    user_agent TEXT,
    ip TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_events_type    ON events(event_type);
  CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_id);
  CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at);
`);

/* Idempotent migration: add geo columns if running against an older db.
   Older events won't have country/region/city — they'll just show as
   Unknown in the dashboard. */
const existingCols = db.prepare("PRAGMA table_info(events)").all().map(c => c.name);
if (!existingCols.includes('country')) db.exec('ALTER TABLE events ADD COLUMN country TEXT');
if (!existingCols.includes('region'))  db.exec('ALTER TABLE events ADD COLUMN region TEXT');
if (!existingCols.includes('city'))    db.exec('ALTER TABLE events ADD COLUMN city TEXT');
db.exec('CREATE INDEX IF NOT EXISTS idx_events_city ON events(city)');

/* ============================================================
   GEO LOOKUP — two-tier:
   1. ip-api.com (online, free, 45 req/min from this server,
                  accurate to city level including China)
   2. geoip-lite (offline, instant, fallback when online fails)
   Cached in-memory by IP so repeat visitors don't re-fetch.
   ============================================================ */
const http = require('http');
const IP_CACHE = new Map();
const IP_CACHE_MAX = 5000;

function cleanIp(ip) {
  return (ip || '').replace(/^::ffff:/, '');
}

/* Synchronous local fallback */
function lookupGeoLocal(ip) {
  if (!ip) return null;
  try {
    const g = geoip.lookup(ip);
    if (!g) return null;
    return {
      country: g.country || null,
      region:  g.region  || null,
      city:    g.city    || null
    };
  } catch (e) {
    return null;
  }
}

/* Online query via ip-api.com (no API key needed for HTTP) */
function lookupGeoOnline(ip) {
  return new Promise((resolve) => {
    if (!ip) return resolve(null);
    const url = `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,countryCode,regionName,city`;
    const req = http.get(url, { timeout: 2500 }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data && data.status === 'success') {
            resolve({
              country: data.countryCode || null,
              region:  data.regionName  || null,
              city:    data.city        || null
            });
          } else {
            resolve(null);
          }
        } catch (e) { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

/* Main entry: cache → online → local */
async function resolveGeo(ip) {
  const clean = cleanIp(ip);
  if (!clean) return null;

  if (IP_CACHE.has(clean)) return IP_CACHE.get(clean);

  /* Try online first (richer city data, esp. for China) */
  let geo = await lookupGeoOnline(clean);

  /* Fall back to local if online failed or returned blank city */
  if (!geo || !geo.city) {
    const local = lookupGeoLocal(clean);
    if (local) {
      geo = {
        country: (geo && geo.country) || local.country,
        region:  (geo && geo.region)  || local.region,
        city:    (geo && geo.city)    || local.city
      };
    }
  }

  if (geo) {
    /* Cap the cache size */
    if (IP_CACHE.size >= IP_CACHE_MAX) {
      const firstKey = IP_CACHE.keys().next().value;
      IP_CACHE.delete(firstKey);
    }
    IP_CACHE.set(clean, geo);
  }
  return geo;
}

const app = express();
app.use(express.json({ limit: '32kb' }));

// Trust the first proxy hop so req.ip reflects the real visitor (Nginx X-Forwarded-For).
app.set('trust proxy', 1);

// CORS — same origin in production, but allow anyway for dev / curl checks.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});

// Whitelist of accepted event types — anything else is rejected.
const ALLOWED_EVENTS = new Set([
  'page_view',
  'start',
  'gender_selected',
  'questions_completed',
  'photo_taken',
  'photo_skipped',
  'character_generated',
  'ticket_saved'
]);

const insertEvent = db.prepare(`
  INSERT INTO events (session_id, event_type, character_id, character_name, gender, source, user_agent, ip, country, region, city)
  VALUES (@session_id, @event_type, @character_id, @character_name, @gender, @source, @user_agent, @ip, @country, @region, @city)
`);

/**
 * POST /api/track
 * Body: { session_id, event, character_id?, character_name?, gender?, source? }
 */
app.post('/api/track', async (req, res) => {
  try {
    const b = req.body || {};
    if (!b.session_id || typeof b.session_id !== 'string') {
      return res.status(400).json({ error: 'session_id required' });
    }
    if (!b.event || !ALLOWED_EVENTS.has(b.event)) {
      return res.status(400).json({ error: 'invalid event' });
    }

    const ua = (req.headers['user-agent'] || '').slice(0, 300);
    const ip = (req.ip || '').slice(0, 64);
    /* Online lookup is ~100-200ms; track is fire-and-forget (sendBeacon)
       so the browser doesn't wait. */
    const geo = await resolveGeo(ip);

    insertEvent.run({
      session_id:     String(b.session_id).slice(0, 64),
      event_type:     b.event,
      character_id:   b.character_id   ? String(b.character_id).slice(0, 64)   : null,
      character_name: b.character_name ? String(b.character_name).slice(0, 64) : null,
      gender:         b.gender         ? String(b.gender).slice(0, 16)         : null,
      source:         b.source         ? String(b.source).slice(0, 64)         : null,
      user_agent:     ua,
      ip:             ip,
      country:        geo ? geo.country : null,
      region:         geo ? geo.region  : null,
      city:           geo ? geo.city    : null
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('track error:', err);
    res.status(500).json({ error: 'internal' });
  }
});

/**
 * GET /api/stats
 * Returns aggregated stats for the dashboard.
 *
 * Auth: accepts the key via either
 *   - HTTP header  X-Dashboard-Key: <key>   (preferred — won't leak via URL)
 *   - query param  ?key=<key>               (legacy fallback)
 * The dashboard frontend uses the header form and stores the key in
 * localStorage, so it never appears in the URL or server access logs.
 */
app.get('/api/stats', (req, res) => {
  const provided = req.headers['x-dashboard-key'] || req.query.key;
  /* Trim to forgive accidental whitespace from copy/paste. */
  const key = typeof provided === 'string' ? provided.trim() : '';
  if (key !== DASHBOARD_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    // Totals by event type
    const totals = db.prepare(`
      SELECT event_type, COUNT(*) AS n, COUNT(DISTINCT session_id) AS uniq
      FROM events
      GROUP BY event_type
    `).all();

    // Character distribution (only on character_generated events)
    const characters = db.prepare(`
      SELECT character_id, character_name, COUNT(*) AS n
      FROM events
      WHERE event_type = 'character_generated' AND character_id IS NOT NULL
      GROUP BY character_id, character_name
      ORDER BY n DESC
    `).all();

    // Gender split among completed sessions
    const genderSplit = db.prepare(`
      SELECT gender, COUNT(*) AS n
      FROM events
      WHERE event_type = 'character_generated' AND gender IS NOT NULL
      GROUP BY gender
    `).all();

    // Source (UTM) split among page_views
    const sourceSplit = db.prepare(`
      SELECT COALESCE(source, 'direct') AS source, COUNT(DISTINCT session_id) AS n
      FROM events
      WHERE event_type = 'page_view'
      GROUP BY source
      ORDER BY n DESC
    `).all();

    // Daily trend — last 30 days, visits vs completions
    const daily = db.prepare(`
      SELECT
        DATE(created_at) AS day,
        SUM(CASE WHEN event_type = 'page_view'           THEN 1 ELSE 0 END) AS visits,
        SUM(CASE WHEN event_type = 'character_generated' THEN 1 ELSE 0 END) AS completions
      FROM events
      WHERE created_at >= datetime('now', '-30 days')
      GROUP BY day
      ORDER BY day ASC
    `).all();

    // Funnel — unique sessions hitting each step
    const funnelSteps = ['page_view', 'start', 'gender_selected', 'questions_completed', 'character_generated', 'ticket_saved'];
    const funnel = funnelSteps.map(step => {
      const row = db.prepare(`
        SELECT COUNT(DISTINCT session_id) AS uniq
        FROM events
        WHERE event_type = ?
      `).get(step);
      return { step, uniq: row.uniq };
    });

    // Top cities (unique sessions) — city level granularity
    const cities = db.prepare(`
      SELECT
        COALESCE(NULLIF(city, ''),    'Unknown') AS city,
        COALESCE(NULLIF(country, ''), '')        AS country,
        COALESCE(NULLIF(region, ''),  '')        AS region,
        COUNT(DISTINCT session_id) AS n
      FROM events
      WHERE event_type = 'page_view'
      GROUP BY city, country, region
      ORDER BY n DESC
      LIMIT 30
    `).all();

    // Country distribution (rolled up)
    const countries = db.prepare(`
      SELECT
        COALESCE(NULLIF(country, ''), 'Unknown') AS country,
        COUNT(DISTINCT session_id) AS n
      FROM events
      WHERE event_type = 'page_view'
      GROUP BY country
      ORDER BY n DESC
    `).all();

    // Recent events — last 20 for the live feed
    const recent = db.prepare(`
      SELECT event_type, character_name, gender, source, city, country, created_at
      FROM events
      ORDER BY id DESC
      LIMIT 20
    `).all();

    res.json({
      generated_at: new Date().toISOString(),
      totals,
      characters,
      gender_split: genderSplit,
      source_split: sourceSplit,
      daily,
      funnel,
      cities,
      countries,
      recent
    });
  } catch (err) {
    console.error('stats error:', err);
    res.status(500).json({ error: 'internal' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

app.listen(PORT, HOST, () => {
  console.log(`[tracker] listening on http://${HOST}:${PORT}`);
  console.log(`[tracker] db: ${DB_PATH}`);
  console.log(`[tracker] dashboard key: ${DASHBOARD_KEY === 'change-me-please' ? '⚠️  DEFAULT — set DASHBOARD_KEY env var!' : 'set ✓'}`);
});
