/* ========================================
   Dashboard logic.
   Loads /api/stats and renders all panels.
   Key is read from ?key= URL param or prompted.
   ======================================== */

const PALETTE = {
  red:       '#c4243a',
  redSoft:   '#a01a2e',
  rouge:     '#d83040',
  green:     '#3a6a4a',
  yellow:    '#f0b830',
  yellowSoft:'#f8dc88',
  ink:       '#2a1a0a',
  inkSoft:   '#5a3a2a',
  inkMute:   'rgba(42, 26, 10, 0.55)',
  cream:     '#fdf2d0',
  creamHi:   '#fff9e0'
};

const EVENT_LABELS = {
  page_view:           { cn: '访问',       en: 'visit',      tag: 'visit'     },
  start:               { cn: '开始',       en: 'start',      tag: 'start'     },
  gender_selected:     { cn: '选性别',     en: 'gender',     tag: 'start'     },
  questions_completed: { cn: '答完题',     en: 'q done',     tag: 'questions' },
  photo_taken:         { cn: '拍照',       en: 'photo',      tag: 'questions' },
  photo_skipped:       { cn: '跳过拍照',   en: 'skip cam',   tag: 'questions' },
  character_generated: { cn: '生成角色',   en: 'character',  tag: 'character' },
  ticket_saved:        { cn: '保存票据',   en: 'ticket',     tag: 'ticket'    }
};

const FUNNEL_LABELS = {
  page_view:           { cn: '访问首页',     en: 'visit'       },
  start:               { cn: '点击开始',     en: 'started'     },
  gender_selected:     { cn: '选择性别',     en: 'gender'      },
  questions_completed: { cn: '答完 6 题',    en: 'all 6 Q'     },
  character_generated: { cn: '生成角色',     en: 'character'   },
  ticket_saved:        { cn: '保存票据',     en: 'ticket'      }
};

let charts = {};
let currentKey = null;
const STORAGE_KEY = 'lt_dashboard_key';

/* ============================================================
   AUTH GATE
   - Key is stored in localStorage so URL stays clean and the
     password never appears in the address bar, history, or
     server access logs. Sent via X-Dashboard-Key header.
   - One-time migration: strip ?key= from URL if it was left there
     by an old bookmark.
   ============================================================ */
function stripKeyFromUrl() {
  const u = new URL(window.location.href);
  if (u.searchParams.has('key')) {
    const keyFromUrl = u.searchParams.get('key');
    if (keyFromUrl && !localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, keyFromUrl.trim());
    }
    u.searchParams.delete('key');
    window.history.replaceState(null, '', u.pathname + (u.search || ''));
  }
}

function getStoredKey() {
  try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
}

function storeKey(k) {
  try { localStorage.setItem(STORAGE_KEY, k); } catch (e) {}
}

function clearStoredKey() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
}

function showGate(errored, message) {
  document.getElementById('gate').hidden = false;
  document.getElementById('dash').hidden = true;
  const err = document.getElementById('gate-err');
  if (err) {
    err.hidden = !errored;
    if (errored) {
      err.textContent = message || '密钥不对 · wrong key';
    }
  }
}
function hideGate() {
  document.getElementById('gate').hidden = true;
  document.getElementById('dash').hidden = false;
  /* Scroll back to top in case the user scrolled while the gate was up. */
  window.scrollTo(0, 0);
}

document.getElementById('gate-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const key = document.getElementById('gate-key').value.trim();
  if (!key) return;
  currentKey = key;
  storeKey(key);
  load();
});

document.getElementById('refresh-btn').addEventListener('click', () => load());

/* ============================================================
   FETCH + LOAD
   ============================================================ */
async function load() {
  console.log('[dashboard] load() with key:', currentKey ? currentKey.slice(0, 3) + '***' + currentKey.slice(-2) : '(none)');
  try {
    const res = await fetch('/api/stats', {
      cache: 'no-store',
      headers: { 'X-Dashboard-Key': currentKey || '' }
    });
    console.log('[dashboard] response status:', res.status);
    if (res.status === 401) {
      clearStoredKey();
      currentKey = null;
      showGate(true, '密钥不对 (HTTP 401) · wrong key');
      return;
    }
    if (!res.ok) {
      showGate(true, '服务器错误 HTTP ' + res.status);
      return;
    }
    const data = await res.json();
    hideGate();
    render(data);
  } catch (err) {
    console.error('[dashboard] fetch error:', err);
    showGate(true, '网络错误：' + (err.message || err));
  }
}

/* ============================================================
   RENDER ALL PANELS
   ============================================================ */
function render(data) {
  /* Meta */
  document.getElementById('generated-at').textContent =
    new Date(data.generated_at).toLocaleString('zh-CN', { hour12: false });

  /* Totals lookup */
  const totals = {};
  data.totals.forEach(t => { totals[t.event_type] = t; });

  const visits     = totals.page_view           ? totals.page_view.uniq           : 0;
  const starts     = totals.start               ? totals.start.uniq               : 0;
  const completed  = totals.character_generated ? totals.character_generated.uniq : 0;

  document.getElementById('stat-visits').textContent    = visits;
  document.getElementById('stat-starts').textContent    = starts;
  document.getElementById('stat-completed').textContent = completed;
  document.getElementById('stat-rate').textContent =
    visits > 0 ? Math.round((completed / visits) * 100) + '%' : '—';

  renderFunnel(data.funnel);
  renderCharacters(data.characters);
  renderDaily(data.daily);
  renderGender(data.gender_split);
  renderSource(data.source_split);
  renderRecent(data.recent);
}

/* ============================================================
   FUNNEL
   ============================================================ */
function renderFunnel(funnel) {
  const wrap = document.getElementById('funnel-chart');
  if (!funnel || funnel.length === 0) {
    wrap.innerHTML = '<div class="empty">暂无数据 · no data yet</div>';
    return;
  }
  const top = funnel[0].uniq || 1;
  wrap.innerHTML = funnel.map((row) => {
    const labels = FUNNEL_LABELS[row.step] || { cn: row.step, en: row.step };
    const pct = top > 0 ? (row.uniq / top) * 100 : 0;
    const pctTxt = top > 0 ? Math.round(pct) + '%' : '—';
    return `
      <div class="funnel-row">
        <div class="funnel-step-label">${labels.cn}<small>${labels.en}</small></div>
        <div class="funnel-bar-track">
          <div class="funnel-bar" style="width:${pct}%"></div>
          <div class="funnel-bar-text">${row.uniq}</div>
        </div>
        <div class="funnel-pct">${pctTxt}</div>
      </div>
    `;
  }).join('');
}

/* ============================================================
   CHARACTERS
   ============================================================ */
function renderCharacters(chars) {
  const wrap = document.getElementById('character-list');
  if (!chars || chars.length === 0) {
    wrap.innerHTML = '<div class="empty">还没有人生成角色 · no characters generated yet</div>';
    return;
  }
  const max = chars[0].n || 1;
  wrap.innerHTML = chars.map((c, i) => {
    const pct = (c.n / max) * 100;
    const rank = String(i + 1).padStart(2, '0');
    const name = c.character_name || c.character_id || '?';
    return `
      <div class="char-row">
        <div class="char-rank">${rank}</div>
        <div class="char-name">${escapeHtml(name)}</div>
        <div class="char-bar-wrap"><div class="char-bar" style="width:${pct}%"></div></div>
        <div class="char-count">${c.n}</div>
      </div>
    `;
  }).join('');
}

/* ============================================================
   DAILY TREND
   ============================================================ */
function renderDaily(daily) {
  const wrap = document.getElementById('daily-wrap');
  if (!wrap) return;
  /* destroy any old chart instance first */
  if (charts.daily) { try { charts.daily.destroy(); } catch (e) {} charts.daily = null; }
  /* remove any previous empty-state node */
  wrap.querySelectorAll('.empty').forEach(n => n.remove());

  let ctx = wrap.querySelector('canvas');
  if (!ctx) {
    /* canvas was removed previously — re-create */
    ctx = document.createElement('canvas');
    ctx.id = 'daily-chart';
    wrap.appendChild(ctx);
  }

  if (!daily || daily.length === 0) {
    ctx.style.display = 'none';
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = '还没有趋势数据 · no trend yet';
    wrap.appendChild(empty);
    return;
  }
  ctx.style.display = '';

  charts.daily = new Chart(ctx, {
    type: 'line',
    data: {
      labels: daily.map(d => d.day.slice(5)),  /* MM-DD */
      datasets: [
        {
          label: '访问 visits',
          data: daily.map(d => d.visits),
          borderColor: PALETTE.green,
          backgroundColor: 'rgba(58, 106, 74, 0.12)',
          borderWidth: 2,
          tension: 0.32,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: PALETTE.green
        },
        {
          label: '完成 completed',
          data: daily.map(d => d.completions),
          borderColor: PALETTE.red,
          backgroundColor: 'rgba(196, 36, 58, 0.12)',
          borderWidth: 2.5,
          tension: 0.32,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: PALETTE.red
        }
      ]
    },
    options: chartBaseOptions({ legend: true })
  });
}

/* ============================================================
   GENDER PIE
   ============================================================ */
function renderGender(split) {
  const wrap = document.getElementById('gender-wrap');
  if (!wrap) return;
  if (charts.gender) { try { charts.gender.destroy(); } catch (e) {} charts.gender = null; }
  wrap.querySelectorAll('.empty').forEach(n => n.remove());

  let ctx = wrap.querySelector('canvas');
  if (!ctx) {
    ctx = document.createElement('canvas');
    ctx.id = 'gender-chart';
    wrap.appendChild(ctx);
  }

  if (!split || split.length === 0) {
    ctx.style.display = 'none';
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = '暂无 · none yet';
    wrap.appendChild(empty);
    return;
  }
  ctx.style.display = '';
  const labelMap = { male: '男 · male', female: '女 · female' };
  charts.gender = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: split.map(s => labelMap[s.gender] || s.gender),
      datasets: [{
        data: split.map(s => s.n),
        backgroundColor: [PALETTE.red, PALETTE.green, PALETTE.yellow],
        borderColor: PALETTE.cream,
        borderWidth: 3
      }]
    },
    options: chartBaseOptions({ legend: true, cutout: '60%' })
  });
}

/* ============================================================
   SOURCE
   ============================================================ */
function renderSource(split) {
  const wrap = document.getElementById('source-list');
  if (!split || split.length === 0) {
    wrap.innerHTML = '<div class="empty">暂无 · none yet</div>';
    return;
  }
  wrap.innerHTML = split.map(s => `
    <div class="source-row">
      <div class="source-name">${escapeHtml(s.source)}</div>
      <div class="source-count">${s.n}</div>
    </div>
  `).join('');
}

/* ============================================================
   RECENT FEED
   ============================================================ */
function renderRecent(recent) {
  const wrap = document.getElementById('recent-list');
  if (!recent || recent.length === 0) {
    wrap.innerHTML = '<div class="empty">还没有事件 · no events yet</div>';
    return;
  }
  wrap.innerHTML = recent.map(r => {
    const label = EVENT_LABELS[r.event_type] || { cn: r.event_type, en: '', tag: '' };
    const time = formatTime(r.created_at);
    const detail = r.character_name
      ? escapeHtml(r.character_name)
      : (r.gender ? (r.gender === 'male' ? '男' : '女') : (r.source || '—'));
    return `
      <div class="recent-row">
        <div class="recent-time">${time}</div>
        <div class="recent-event">
          <span class="ev-tag tag-${label.tag}">${label.cn}</span>
        </div>
        <div class="recent-detail">${detail}</div>
      </div>
    `;
  }).join('');
}

/* ============================================================
   HELPERS
   ============================================================ */
function chartBaseOptions(opts = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: opts.cutout,
    plugins: {
      legend: {
        display: !!opts.legend,
        position: 'bottom',
        labels: {
          font: { family: 'Cormorant Garamond, Georgia, serif', size: 13 },
          color: PALETTE.inkSoft,
          boxWidth: 10,
          padding: 14
        }
      },
      tooltip: {
        backgroundColor: PALETTE.ink,
        titleFont: { family: 'Noto Serif SC, serif', size: 12 },
        bodyFont:  { family: 'Cormorant Garamond, serif', size: 13 },
        padding: 10,
        cornerRadius: 3
      }
    },
    scales: {
      x: {
        ticks: { color: PALETTE.inkMute, font: { family: 'Cormorant Garamond, serif', size: 11 } },
        grid:  { color: 'rgba(42, 26, 10, 0.08)' }
      },
      y: {
        beginAtZero: true,
        ticks: { color: PALETTE.inkMute, font: { family: 'Cormorant Garamond, serif', size: 11 }, precision: 0 },
        grid:  { color: 'rgba(42, 26, 10, 0.08)' }
      }
    }
  };
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatTime(ts) {
  /* SQLite default is UTC string like "2026-05-14 09:55:00" */
  const d = new Date(ts.replace(' ', 'T') + 'Z');
  if (isNaN(d.getTime())) return ts;
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
}

/* ============================================================
   BOOT
   ============================================================ */
function readKeyFromHash() {
  /* Support one-click login via URL hash: /dashboard/#key=YOUR_KEY
     Hash is NOT sent to the server (no access-log leakage) and is
     cleaned from the address bar immediately. */
  const m = window.location.hash.match(/(?:^#|&)key=([^&]+)/);
  if (!m) return null;
  return decodeURIComponent(m[1]).trim();
}

(function boot() {
  /* Priority 1: hash key (one-click login URL) */
  const hashKey = readKeyFromHash();
  if (hashKey) {
    currentKey = hashKey;
    storeKey(hashKey);
    window.history.replaceState(null, '', window.location.pathname);
  }

  /* Priority 2: migrate legacy ?key= from URL into localStorage */
  stripKeyFromUrl();

  /* Priority 3: previously stored key */
  if (!currentKey) currentKey = getStoredKey();

  if (!currentKey) {
    showGate(false);
  } else {
    load();
  }
})();
