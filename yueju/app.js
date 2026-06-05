/* ========================================
   App Logic: state machine + portrait gen +
   camera capture + face analysis + matching
   ======================================== */

/* ========================================
   ANALYTICS / TRACKING
   Fire-and-forget calls to /api/track.
   Never blocks UI, never throws.
   ======================================== */
(function setupTracking() {
  /* session_id: persists across the whole visit (one playthrough = one session) */
  let sid = sessionStorage.getItem('lt_sid');
  if (!sid) {
    sid = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
    sessionStorage.setItem('lt_sid', sid);
  }

  /* UTM-style source: read once from URL, persist for the session */
  let source = sessionStorage.getItem('lt_source');
  if (!source) {
    const u = new URL(window.location.href);
    source = u.searchParams.get('source') || u.searchParams.get('utm_source') || null;
    if (source) sessionStorage.setItem('lt_source', source);
  }

  window.__track = function (event, extra) {
    try {
      const payload = Object.assign({
        session_id: sid,
        event: event,
        source: source
      }, extra || {});

      const body = JSON.stringify(payload);

      /* Prefer sendBeacon — survives page unload, doesn't block. */
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon('/api/track', blob);
      } else {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: body,
          keepalive: true
        }).catch(() => {});
      }
    } catch (e) {
      /* Tracking must never break the app. */
    }
  };
})();

/* Fire page_view as soon as the script loads. */
window.__track('page_view');

const state = {
  lang: 'zh',
  screen: 'welcome',
  qIndex: 0,
  gender: null,                // 'male' | 'female'
  traitTotals: { '痴情': 0, '烈': 0, '飘逸': 0, '智慧': 0, '谐趣': 0, '决绝': 0 },
  matchedCharacter: null,
  ticketSerial: null,
  cameraStream: null,
  capturedPhoto: null,         // dataURL
  faceWeights: null            // trait weights extracted from photo
};

const $app = document.getElementById('app');

/* ============= helpers ============= */
function t(key, vars) {
  let s = window.STRINGS[state.lang][key] || '';
  if (vars) Object.keys(vars).forEach(k => { s = s.replace('{' + k + '}', vars[k]); });
  return s;
}

function altLang(en, zh) { return state.lang === 'zh' ? zh : en; }

function generateSerial() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const r = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
  return `${yy}${mm}${dd}-${r}`;
}

function setLang(lang) { state.lang = lang; render(); }

function emptyTraits() {
  return { '痴情': 0, '烈': 0, '飘逸': 0, '智慧': 0, '谐趣': 0, '决绝': 0 };
}

/* ========================================
   PORTRAIT GENERATOR — moved to portraits.js
   window.generatePortrait(character) is provided there.
   ======================================== */

/* If the character has a real illustration (image field), use that;
   otherwise fall back to the procedural SVG portrait. */
function renderCharacterPortrait(character) {
  if (!character) return '';
  if (character.image) {
    const alt = character.name_cn || character.name_en || '';
    return `<img class="character-photo" src="${character.image}" alt="${alt}" />`;
  }
  return generatePortrait(character);
}
/* ========================================
   FACE PHOTO ANALYSIS
   Sample center region of captured photo,
   compute color stats, derive trait weights.
   ======================================== */

function analyzePhoto(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;

  /* Sample the center 50% region (face is usually centered) */
  const sx = Math.floor(w * 0.25);
  const sy = Math.floor(h * 0.25);
  const sw = Math.floor(w * 0.5);
  const sh = Math.floor(h * 0.5);
  const data = ctx.getImageData(sx, sy, sw, sh).data;

  let totalR = 0, totalG = 0, totalB = 0;
  const pixelCount = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    totalR += data[i];
    totalG += data[i + 1];
    totalB += data[i + 2];
  }

  const avgR = totalR / pixelCount;
  const avgG = totalG / pixelCount;
  const avgB = totalB / pixelCount;
  const avgGray = (avgR + avgG + avgB) / 3;

  const brightness = avgGray / 255;                                  // 0..1
  const warmth = (avgR - avgB) / 255;                                // -1..1
  const saturation = (Math.abs(avgR - avgGray) + Math.abs(avgG - avgGray) + Math.abs(avgB - avgGray)) / (3 * 60);

  const w_ = emptyTraits();

  /* Brightness: dim → 决绝/烈, bright → 谐趣/痴情 */
  if (brightness > 0.55) {
    w_['谐趣'] += 1.2;
    w_['痴情'] += 0.6;
  } else {
    w_['决绝'] += 1.2;
    w_['烈'] += 0.6;
  }

  /* Warmth: warm → 痴情/烈, cool → 飘逸/智慧 */
  if (warmth > 0.04) {
    w_['痴情'] += 1;
    w_['烈'] += 0.5;
  } else if (warmth < -0.04) {
    w_['飘逸'] += 1;
    w_['智慧'] += 0.5;
  }

  /* Saturation: high → 烈/谐趣, low → 飘逸/智慧 */
  if (saturation > 0.5) {
    w_['烈'] += 0.6;
    w_['谐趣'] += 0.6;
  } else {
    w_['飘逸'] += 0.6;
    w_['智慧'] += 0.6;
  }

  return w_;
}

/* ========================================
   MATCHING ALGORITHM
   Cosine similarity between user trait
   totals (questions + face) and each
   character's profile.
   ======================================== */

function computeMatch() {
  /* Combine question-derived traits with face-derived traits */
  const combined = emptyTraits();
  Object.keys(state.traitTotals).forEach(k => combined[k] = state.traitTotals[k]);
  if (state.faceWeights) {
    Object.keys(state.faceWeights).forEach(k => combined[k] += state.faceWeights[k] || 0);
  }

  const userVec = window.TRAITS.map(t => combined[t]);
  let bestChar = null;
  let bestScore = -Infinity;

  /* Use the active 15-character pool when defined, falling back to
     the full historical 60 if data-active.js isn't loaded. */
  const sourcePool = (window.ACTIVE_CHARACTERS && window.ACTIVE_CHARACTERS.length > 0)
    ? window.ACTIVE_CHARACTERS
    : window.CHARACTERS;

  /* Filter by selected gender — match only within the user's gender pool */
  const pool = state.gender
    ? sourcePool.filter(c => c.gender === state.gender)
    : sourcePool;

  for (const char of pool) {
    const charVec = window.TRAITS.map(t => char.traits[t]);
    const score = cosineSim(userVec, charVec);
    if (score > bestScore) {
      bestScore = score;
      bestChar = char;
    }
  }
  return bestChar;
}

function cosineSim(a, b) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

/* ========================================
   TOP BAR (shared)
   ======================================== */
function renderTopBar() {
  return `
    <div class="topbar">
      <div class="brand">
        <div class="brand-title">一隅回音</div>
        <div class="brand-sub">粵劇 × 咖啡</div>
        <div class="brand-tagline">A Touch of Cantonese Opera</div>
        <div class="brand-tagline">From a Drop of Coffee</div>
      </div>
      <div class="lang-switch">
        <button class="${state.lang === 'zh' ? 'active' : ''}" data-lang="zh">中文</button>
        <button class="${state.lang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
      </div>
    </div>
  `;
}

/* ========================================
   SCREENS
   ======================================== */

function renderWelcome() {
  return `
    ${renderTopBar()}
    <div class="screen welcome">
      <div class="welcome-logo">
        <img src="logo.jpg" alt="Petit Echo · 一隅回音" />
      </div>
      <div>
        <h1 class="welcome-title">${t('welcome_main')}</h1>
        <div class="en-title">${t('welcome_en')}</div>
      </div>
      <div class="welcome-divider"></div>
      <div class="question-mark">${t('welcome_invite')}</div>
      <div class="invite-text">${t('welcome_invite_en')}</div>
      <div class="center-action">
        <button class="btn btn-primary" data-action="start">${t('start_btn')}</button>
      </div>
    </div>
  `;
}

function renderIntro() {
  return `
    ${renderTopBar()}
    <div class="screen intro">
      <div class="intro-coffee">☕</div>
      <p>${t('intro_line1')}</p>
      <p>${t('intro_line2')}</p>
      <p>${t('intro_line3')}</p>
      <div class="center-action">
        <button class="btn" data-action="to-gender">${t('intro_continue')}</button>
      </div>
    </div>
  `;
}

function renderGender() {
  return `
    ${renderTopBar()}
    <div class="screen gender">
      <div class="label">${t('gender_label')}</div>
      <h2 class="gender-main">${t('gender_main')}</h2>
      <p class="gender-main-en">${t('gender_main_en')}</p>
      <div class="gender-options">
        <button class="gender-option" data-action="set-gender" data-gender="male">
          <div class="gender-icon">♂</div>
          <div class="gender-text">${t('gender_male')}</div>
          <div class="gender-text-en">${t('gender_male_en')}</div>
        </button>
        <button class="gender-option" data-action="set-gender" data-gender="female">
          <div class="gender-icon">♀</div>
          <div class="gender-text">${t('gender_female')}</div>
          <div class="gender-text-en">${t('gender_female_en')}</div>
        </button>
      </div>
      <p class="gender-note">${t('gender_note')}</p>
      <p class="gender-note-en">${t('gender_note_en')}</p>
    </div>
  `;
}

function renderQuestion() {
  const q = window.QUESTIONS[state.qIndex];
  const progressBars = window.QUESTIONS.map((_, i) => {
    let cls = '';
    if (i < state.qIndex) cls = 'done';
    else if (i === state.qIndex) cls = 'current';
    return `<span class="${cls}"></span>`;
  }).join('');

  return `
    ${renderTopBar()}
    <div class="screen question">
      <div class="q-progress">${progressBars}</div>
      <div class="q-num">${t('q_progress', { n: state.qIndex + 1 })}</div>
      <h2 class="q-title">${altLang(q.title_en, q.title_cn)}</h2>
      <div class="q-title-en">${altLang(q.title_cn, q.title_en)}</div>
      <div class="options">
        ${q.options.map((opt, i) => `
          <button class="option" data-action="answer" data-idx="${i}">
            <div class="option-text">${altLang(opt.text_en, opt.text_cn)}</div>
            <div class="option-text-en">${altLang(opt.text_cn, opt.text_en)}</div>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function renderCameraIntro() {
  return `
    ${renderTopBar()}
    <div class="screen camera-intro">
      <div class="label">${t('camera_intro_label')}</div>
      <div class="camera-icon">👁</div>
      <p class="camera-intro-main">${t('camera_intro_main')}</p>
      <p class="camera-intro-main-en">${t('camera_intro_main_en')}</p>
      <p class="camera-intro-sub">${t('camera_intro_sub')}</p>
      <p class="camera-intro-sub-en">${t('camera_intro_sub_en')}</p>
      <div class="center-action">
        <button class="btn btn-primary" data-action="open-camera">${t('camera_take')}</button>
        <button class="btn btn-ghost" data-action="skip-camera">${t('camera_skip')}</button>
      </div>
    </div>
  `;
}

function renderCameraLive() {
  return `
    ${renderTopBar()}
    <div class="screen camera-live">
      <div class="camera-frame">
        <video id="camera-video" autoplay playsinline muted></video>
        <div class="camera-frame-overlay">
          <div class="camera-corner tl"></div>
          <div class="camera-corner tr"></div>
          <div class="camera-corner bl"></div>
          <div class="camera-corner br"></div>
        </div>
      </div>
      <div class="camera-actions">
        <button class="btn btn-ghost" data-action="skip-camera">${t('camera_skip')}</button>
        <button class="shutter" data-action="capture-shot" aria-label="capture"></button>
        <div style="width:60px"></div>
      </div>
    </div>
  `;
}

function renderCameraReview() {
  return `
    ${renderTopBar()}
    <div class="screen camera-review">
      <div class="camera-frame">
        <img src="${state.capturedPhoto}" alt="captured" />
      </div>
      <div class="ticket-actions">
        <button class="btn btn-ghost" data-action="retake-photo">${t('camera_retake')}</button>
        <button class="btn btn-primary" data-action="use-photo">${t('camera_use')}</button>
      </div>
    </div>
  `;
}

function renderLoading() {
  const text = state.faceWeights ? t('reading_face_text') : t('loading_text');
  const textEn = state.faceWeights ? t('reading_face_text_en') : t('loading_text_en');
  return `
    ${renderTopBar()}
    <div class="screen loading">
      <div class="loading-orb"></div>
      <p>${text}</p>
      <p class="en">${textEn}</p>
    </div>
  `;
}

function renderResult() {
  const c = state.matchedCharacter;
  return `
    ${renderTopBar()}
    <div class="screen result">
      <div class="result-prelude">${t('result_prelude')}</div>
      <div class="portrait-frame">${renderCharacterPortrait(c)}</div>
      <div class="result-name-cn">${altLang(c.name_en, c.name_cn)}</div>
      <div class="result-name-en">${altLang(c.name_cn, c.name_en)}</div>
      <div class="result-from">${t('result_from', { play: altLang(c.play_en, c.play_cn) })}</div>
      <div class="result-quote">"${altLang(c.quote_en, c.quote_cn)}"</div>
      ${c.coffee_cn ? `
      <div class="result-coffee">
        <span class="coffee-label">豆香</span>
        <span class="coffee-text">${c.coffee_cn}</span>
      </div>` : ''}
      <div class="result-letter">
        ${altLang(c.letter_en, c.letter_cn)}
        <div class="result-letter-en">${altLang(c.letter_cn, c.letter_en)}</div>
      </div>
      <div class="center-action">
        <button class="btn btn-ghost" data-action="restart">${t('play_again')}</button>
      </div>
    </div>
  `;
}

function renderMonologue() {
  const c = state.matchedCharacter;
  return `
    ${renderTopBar()}
    <div class="screen monologue">
      <div class="video-placeholder">
        <div class="video-portrait-bg">${renderCharacterPortrait(c)}</div>
        <div class="video-placeholder-content">
          <div class="video-placeholder-meta">${t('monologue_meta')}</div>
          <div class="video-placeholder-spoken">"${altLang(c.monologue_en, c.monologue_cn)}"</div>
          <div class="video-placeholder-spoken-en">${altLang(c.monologue_cn, c.monologue_en)}</div>
        </div>
      </div>
      <div class="center-action">
        <button class="btn btn-primary" data-action="to-ticket">${t('to_ticket')}</button>
      </div>
    </div>
  `;
}

function renderTicket() {
  const c = state.matchedCharacter;
  if (!state.ticketSerial) state.ticketSerial = generateSerial();

  const seed = state.ticketSerial.split('-').join('');
  const qrCells = [];
  for (let i = 0; i < 64; i++) {
    const charCode = seed.charCodeAt(i % seed.length);
    const filled = (charCode + i * 7) % 3 === 0;
    qrCells.push(`<div style="${filled ? '' : 'background:transparent'}"></div>`);
  }

  return `
    ${renderTopBar()}
    <div class="screen ticket-screen">
      <div class="label">${t('your_card')}</div>
      <div class="ticket" id="ticket-capture">
        <div class="ticket-notch-l"></div>
        <div class="ticket-notch-r"></div>
        <div class="ticket-header">
          <div class="ticket-brand">
            <div class="ticket-brand-cn">${t('ticket_brand_cn')}</div>
            <div class="ticket-brand-en">${t('ticket_brand_en')}</div>
          </div>
          <div class="ticket-meta">
            NO. ${state.ticketSerial}<br>
            ${altLang('Issued today', '今日初发')}
          </div>
        </div>
        <div class="ticket-portrait">${renderCharacterPortrait(c)}</div>
        <div style="text-align:center;padding:6px 0">
          <div class="ticket-bearer-cn">${altLang(c.name_en, c.name_cn)}</div>
          <div class="ticket-bearer-en">${altLang(c.name_cn, c.name_en)}</div>
          <div class="ticket-source">${altLang('from ' + c.play_en, '来自 ' + c.play_cn)}</div>
        </div>
        <div class="ticket-quote">
          <div class="ticket-quote-cn">"${altLang(c.quote_en, c.quote_cn)}"</div>
        </div>
        <div class="ticket-footer">
          <div class="ticket-event">
            <div class="ticket-event-label">${t('ticket_venue')}</div>
            <div class="ticket-event-detail">${t('ticket_when')}</div>
          </div>
          <div class="ticket-qr">${qrCells.join('')}</div>
        </div>
      </div>
      <div class="ticket-actions">
        <button class="btn" data-action="save-ticket">${t('save_image')}</button>
        <button class="btn btn-ghost" data-action="restart">${t('play_again')}</button>
      </div>
    </div>
  `;
}

/* ========================================
   MAIN RENDER
   ======================================== */
function render() {
  let html = '';
  switch (state.screen) {
    case 'welcome':       html = renderWelcome(); break;
    case 'intro':         html = renderIntro(); break;
    case 'gender':        html = renderGender(); break;
    case 'question':      html = renderQuestion(); break;
    case 'camera-intro':  html = renderCameraIntro(); break;
    case 'camera-live':   html = renderCameraLive(); break;
    case 'camera-review': html = renderCameraReview(); break;
    case 'loading':       html = renderLoading(); break;
    case 'result':        html = renderResult(); break;
    case 'monologue':     html = renderMonologue(); break;
    case 'ticket':        html = renderTicket(); break;
  }
  $app.innerHTML = html;

  /* After camera-live render, wire up the video stream */
  if (state.screen === 'camera-live' && state.cameraStream) {
    const video = document.getElementById('camera-video');
    if (video) video.srcObject = state.cameraStream;
  }

  /* After ticket render, play folding-fan entrance animation */
  if (state.screen === 'ticket') {
    playFanReveal();
  }
}

/* ========================================
   CAMERA HANDLERS
   ======================================== */

async function openCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } },
      audio: false
    });
    state.cameraStream = stream;
    state.screen = 'camera-live';
    render();
  } catch (err) {
    alert(t('camera_perm_denied'));
    /* Skip on denial */
    proceedToMatch();
  }
}

function captureShot() {
  const video = document.getElementById('camera-video');
  if (!video) return;
  const canvas = document.createElement('canvas');
  const w = video.videoWidth, h = video.videoHeight;
  if (!w || !h) return;
  /* Mirror the captured image so it matches preview */
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.translate(w, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, w, h);

  state.capturedPhoto = canvas.toDataURL('image/png');
  state.faceWeights = analyzePhoto(canvas);
  window.__track('photo_taken');
  stopCamera();
  state.screen = 'camera-review';
  render();
}

function stopCamera() {
  if (state.cameraStream) {
    state.cameraStream.getTracks().forEach(t => t.stop());
    state.cameraStream = null;
  }
}

function proceedToMatch() {
  state.screen = 'loading';
  render();
  setTimeout(() => {
    state.matchedCharacter = computeMatch();
    /* The critical conversion event — we have a result. */
    window.__track('character_generated', {
      character_id:   state.matchedCharacter ? state.matchedCharacter.id      : null,
      character_name: state.matchedCharacter ? state.matchedCharacter.name_cn : null,
      gender:         state.gender
    });
    state.screen = 'result';
    render();
  }, 2400);
}

/* ========================================
   EVENT DELEGATION
   ======================================== */
$app.addEventListener('click', (e) => {
  const langBtn = e.target.closest('[data-lang]');
  if (langBtn) { setLang(langBtn.dataset.lang); return; }

  const actionEl = e.target.closest('[data-action]');
  if (!actionEl) return;
  const action = actionEl.dataset.action;

  switch (action) {
    case 'start':
      window.__track('start');
      state.screen = 'intro';
      render();
      break;

    case 'to-gender':
      state.screen = 'gender';
      render();
      break;

    case 'set-gender':
      state.gender = actionEl.dataset.gender;
      window.__track('gender_selected', { gender: state.gender });
      state.screen = 'question';
      state.qIndex = 0;
      state.traitTotals = emptyTraits();
      state.faceWeights = null;
      state.capturedPhoto = null;
      render();
      break;

    case 'answer': {
      const idx = parseInt(actionEl.dataset.idx, 10);
      const opt = window.QUESTIONS[state.qIndex].options[idx];
      Object.keys(opt.weights).forEach(k => state.traitTotals[k] += opt.weights[k]);

      if (state.qIndex < window.QUESTIONS.length - 1) {
        state.qIndex += 1;
        render();
      } else {
        /* All questions answered: go to camera intro */
        window.__track('questions_completed');
        state.screen = 'camera-intro';
        render();
      }
      break;
    }

    case 'open-camera':
      openCamera();
      break;

    case 'capture-shot':
      captureShot();
      break;

    case 'retake-photo':
      state.capturedPhoto = null;
      state.faceWeights = null;
      openCamera();
      break;

    case 'use-photo':
      proceedToMatch();
      break;

    case 'skip-camera':
      window.__track('photo_skipped');
      stopCamera();
      proceedToMatch();
      break;

    case 'to-monologue':
      state.screen = 'monologue';
      render();
      break;

    case 'to-ticket':
      state.screen = 'ticket';
      render();
      break;

    case 'save-ticket':
      window.__track('ticket_saved');
      saveTicket();
      break;

    case 'restart':
      state.screen = 'welcome';
      state.qIndex = 0;
      state.gender = null;
      state.traitTotals = emptyTraits();
      state.matchedCharacter = null;
      state.ticketSerial = null;
      state.faceWeights = null;
      state.capturedPhoto = null;
      stopCamera();
      /* Reset fan animation guard so it plays again next round */
      const prevTicket = document.getElementById('ticket-capture');
      if (prevTicket) delete prevTicket.dataset.fanPlayed;
      render();
      break;
  }
});

/* ========================================
   FAN REVEAL ANIMATION
   Ticket entrance: 9 colored panels rotate
   outward from a shared bottom-center pivot,
   simulating a Chinese folding fan opening.
   ======================================== */
function playFanReveal() {
  /* Guard: only play once per ticket render */
  const ticket = document.getElementById('ticket-capture');
  if (!ticket || ticket.dataset.fanPlayed) return;
  ticket.dataset.fanPlayed = 'true';

  /* Two RAFs: ensures layout is fully painted before we measure */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {

      const rect   = ticket.getBoundingClientRect();
      const W      = rect.width;
      const H      = rect.height;
      const N      = 9;

      /* Alternating deep-red / warm-gold panels, like 粤剧 stage curtain */
      const COLORS = [
        '#6B1212', '#D4A460', '#8B1A1A',
        '#C8955A', '#7B1616',
        '#C8955A', '#8B1A1A',
        '#D4A460', '#6B1212'
      ];

      /* ── Overlay: fixed, positioned exactly over the ticket ── */
      const overlay = document.createElement('div');
      overlay.style.cssText =
        'position:fixed;' +
        'top:'    + rect.top  + 'px;' +
        'left:'   + rect.left + 'px;' +
        'width:'  + W + 'px;' +
        'height:' + H + 'px;' +
        'z-index:999;pointer-events:none;overflow:visible;';
      document.body.appendChild(overlay);

      /* Hide ticket content; disable save button during animation */
      ticket.style.opacity  = '0';
      ticket.style.transition = 'none';
      const saveBtn = document.querySelector('[data-action="save-ticket"]');
      if (saveBtn) saveBtn.disabled = true;

      /* ── Build N panels ── */
      /*
        Each panel is full overlay size (inset:0), clip-path restricts
        it to its own strip.  transform-origin:50% 100% = bottom-center
        of the overlay = bottom-center of the ticket.  All panels share
        the same pivot, so they rotate like ribs of a folding fan.

        Geometry:
          open angle of rib i  = atan2(dx, H/2)
            where dx = center-x-of-strip − W/2
          closed rotation      = −openAngle
            (rotates rib to point straight up from pivot)
        Animation: closed → 0° (natural/open)
      */
      const panels = [];
      for (let i = 0; i < N; i++) {
        const centerT  = (i + 0.5) / N;
        const dx       = (centerT - 0.5) * W;
        const openDeg  = Math.atan2(dx, H / 2) * (180 / Math.PI);
        const closedDeg = -openDeg;

        const leftPct  = (i       / N * 100).toFixed(2);
        const rightPct = ((N-i-1) / N * 100).toFixed(2);

        const p = document.createElement('div');
        p.style.cssText =
          'position:absolute;inset:0;' +
          'background:' + COLORS[i] + ';' +
          /* clip-path shows only this rib's strip */
          'clip-path:inset(0 ' + rightPct + '% 0 ' + leftPct + '%);' +
          /* shared pivot = ticket bottom-centre */
          'transform-origin:50% 100%;' +
          'transform:rotate(' + closedDeg.toFixed(2) + 'deg);' +
          /* thin gold rib line on right edge */
          'box-shadow:inset -1.5px 0 0 rgba(210,175,60,0.75);' +
          'will-change:transform,opacity;';
        overlay.appendChild(p);
        panels.push({ el: p });
      }

      /* ── Stagger & animate ──
         Outer ribs first (most travel), centre rib last.
         delay: edges=0 ms, centre=MAX_STAGGER ms
      */
      const SPREAD_DUR  = 560;  /* ms, swing-into-place duration */
      const MAX_STAGGER = 200;  /* ms extra wait for centre rib   */
      const EASING      = 'cubic-bezier(0.34,1.35,0.64,1)'; /* spring */

      panels.forEach(function (panel, i) {
        const distFromCenter =
          Math.abs(i - (N - 1) / 2) / ((N - 1) / 2); /* 1=edge, 0=centre */
        const delay = Math.round((1 - distFromCenter) * MAX_STAGGER);

        setTimeout(function () {
          panel.el.style.transition =
            'transform ' + SPREAD_DUR + 'ms ' + EASING;
          panel.el.style.transform = 'rotate(0deg)';
        }, delay);
      });

      /* ── Fade out overlay, fade in ticket ── */
      const fadeDelay = MAX_STAGGER + SPREAD_DUR + 60;

      setTimeout(function () {
        overlay.style.transition  = 'opacity 360ms ease';
        overlay.style.opacity     = '0';
        ticket.style.transition   = 'opacity 420ms ease';
        ticket.style.opacity      = '1';
      }, fadeDelay);

      /* ── Clean up ── */
      const cleanupAt = fadeDelay + 440;
      setTimeout(function () {
        overlay.remove();
        ticket.style.opacity    = '';
        ticket.style.transition = '';
        if (saveBtn) saveBtn.disabled = false;
      }, cleanupAt);

    }); /* end second RAF */
  }); /* end first RAF */
}

/* ========================================
   SAVE TICKET AS PNG
   ======================================== */
function saveTicket() {
  const node = document.getElementById('ticket-capture');
  if (!node) return;
  if (typeof html2canvas !== 'function') {
    alert(altLang(
      'Image saving requires internet (html2canvas library). Long-press the ticket and select "Save Image" instead.',
      '保存图片需要联网（依赖 html2canvas 库）。或者长按票面 → 保存图片。'
    ));
    return;
  }
  html2canvas(node, { backgroundColor: null, scale: 2, useCORS: true })
    .then(canvas => {
      const link = document.createElement('a');
      link.download = `cantonese-opera-ticket-${state.ticketSerial}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    })
    .catch(err => {
      console.error(err);
      alert(altLang('Could not save image. Try long-press to save instead.', '保存失败，请长按票面保存。'));
    });
}

/* ============= boot ============= */
render();
