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
  INSERT INTO events (session_id, event_type, character_id, character_name, gender, source, user_agent, ip)
  VALUES (@session_id, @event_type, @character_id, @character_name, @gender, @source, @user_agent, @ip)
`);

/**
 * POST /api/track
 * Body: { session_id, event, character_id?, character_name?, gender?, source? }
 */
app.post('/api/track', (req, res) => {
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

    insertEvent.run({
      session_id:     String(b.session_id).slice(0, 64),
      event_type:     b.event,
      character_id:   b.character_id   ? String(b.character_id).slice(0, 64)   : null,
      character_name: b.character_name ? String(b.character_name).slice(0, 64) : null,
      gender:         b.gender         ? String(b.gender).slice(0, 16)         : null,
      source:         b.source         ? String(b.source).slice(0, 64)         : null,
      user_agent:     ua,
      ip:             ip
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('track error:', err);
    res.status(500).json({ error: 'internal' });
  }
});

/**
 * GET /api/stats?key=...
 * Returns aggregated stats for the dashboard.
 */
app.get('/api/stats', (req, res) => {
  if (req.query.key !== DASHBOARD_KEY) {
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

    // Recent events — last 20 for the live feed
    const recent = db.prepare(`
      SELECT event_type, character_name, gender, source, created_at
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
