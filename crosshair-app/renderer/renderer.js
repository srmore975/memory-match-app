const svg = document.getElementById('crosshair');

let cfg = {};
let defaults = {};
let displays = [];

/* ---------------- Utilities ---------------- */

function hexToRgba(hex, a) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return `rgba(0,240,255,${a})`;
  return `rgba(${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}, ${a})`;
}

function glowString() {
  if (!cfg.glow || cfg.glow <= 0) return 'none';
  const s = Math.round(3 + cfg.glow * 7);
  const a = hexToRgba(cfg.color, 0.85);
  const b = hexToRgba(cfg.color, 0.5);
  const c = hexToRgba(cfg.accent, 0.4);
  return [
    `drop-shadow(0 0 ${s}px ${a})`,
    `drop-shadow(0 0 ${s * 2.2}px ${b})`,
    `drop-shadow(0 0 ${s * 1.5}px ${c})`,
    `drop-shadow(0 0 ${s * 4}px ${c})`,
  ].join(' ');
}

function rect(x, y, w, h, fill, rx) {
  return `<rect x="${x}" y="${y}" width="${Math.max(0.5, w)}" height="${Math.max(0.5, h)}" rx="${rx}" fill="${fill}"/>`;
}

function arms(tw, fill, o) {
  const a = cfg.size;
  const g = cfg.gap;
  const w = tw + o * 2;
  const rxx = w / 2;
  const half = o;
  return (
    rect(-w / 2, -(g + a) - half, w, a + half * 2, fill, rxx) +
    rect(-w / 2, g - half, w, a + half * 2, fill, rxx) +
    rect(-(g + a) - half, -w / 2, a + half * 2, w, fill, rxx) +
    rect(g - half, -w / 2, a + half * 2, w, fill, rxx)
  );
}

function corners(tw, fill, o) {
  const d = cfg.gap + cfg.size * 0.42;
  const tick = cfg.size * 0.58;
  const w = tw + o * 2;
  let s = '';
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      const hx = Math.min(sx * d, sx * (d + tick));
      const hy = Math.min(sy * d, sy * (d + tick));
      s += rect(hx - o, sy * d - w / 2, tick + o * 2, w, fill, w / 2);
      s += rect(sx * d - w / 2, hy - o, w, tick + o * 2, fill, w / 2);
    }
  }
  return s;
}

function ringStyle(tw, fill) {
  return `<circle cx="0" cy="0" r="${cfg.ring}" fill="none" stroke="${fill}" stroke-width="${tw}"/>`;
}

/* ---------------- Crosshair builder ---------------- */

function buildCrosshair() {
  const style = cfg.style;
  const t = cfg.thickness;
  const t2 = Math.max(1, t * 0.34);
  const ol = cfg.outline ? Math.max(1.2, t * 0.16) : 0;
  const half = cfg.size + cfg.gap + t + 42;
  const W = Math.round(half * 2);

  let outline = '';
  let neon = '';

  if (style === 'cross' || style === 'cross-dot') {
    if (cfg.outline) outline += arms(t, '#000', ol);
    neon += arms(t, cfg.color, 0) + arms(t2, '#ffffff');
  } else if (style === 'corners') {
    if (cfg.outline) outline += corners(t, '#000', ol);
    neon += corners(t, cfg.color, 0) + corners(t2, '#ffffff');
  }

  if (cfg.dot > 0 && (style === 'dot' || style === 'dot-ring' || style === 'cross-dot')) {
    if (cfg.outline) outline += `<circle cx="0" cy="0" r="${cfg.dot + ol}" fill="#000"/>`;
    neon += `<circle cx="0" cy="0" r="${cfg.dot}" fill="${cfg.color}"/>`;
    neon += `<circle cx="0" cy="0" r="${Math.max(1, cfg.dot * 0.45)}" fill="#ffffff"/>`;
  }

  if (style === 'ring' || style === 'dot-ring') {
    if (cfg.outline) outline += ringStyle(t + ol * 2, '#000');
    neon += ringStyle(t, cfg.color);
    neon += ringStyle(t2, '#ffffff');
  }

  const lensR = Math.max(3, (cfg.gap > 2 ? cfg.gap * 0.72 : cfg.dot * 0.85));
  neon += `<circle cx="0" cy="0" r="${lensR}" fill="url(#lens)"/>`;

  svg.setAttribute('viewBox', `0 0 ${W} ${W}`);
  svg.setAttribute('width', W);
  svg.setAttribute('height', W);
  svg.style.opacity = cfg.opacity;
  svg.style.transform = `translate(calc(-50% + ${cfg.offsetX}px), calc(-50% + ${cfg.offsetY}px))`;

  svg.innerHTML = `
    <defs>
      <radialGradient id="lens" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/>
        <stop offset="70%" stop-color="#ffffff" stop-opacity="0.03"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <g transform="translate(${W / 2}, ${W / 2})">
      <g>${outline}</g>
      <g style="filter:${glowString()}">${neon}</g>
    </g>`;
}

/* ---------------- UI wiring ---------------- */

const STYLES = [
  { id: 'cross', label: 'Cross' },
  { id: 'dot', label: 'Dot' },
  { id: 'ring', label: 'Ring' },
  { id: 'dot-ring', label: 'Dot+Ring' },
  { id: 'cross-dot', label: 'Cross+Dot' },
  { id: 'corners', label: 'Corners' },
];

const PRESETS = [
  { c: '#00f0ff', a: '#ff2bd6' },
  { c: '#53f06a', a: '#0ae2d0' },
  { c: '#ff3355', a: '#ff8a3d' },
  { c: '#ffd54a', a: '#ff7eb6' },
  { c: '#b38bff', a: '#5f6bff' },
  { c: '#ffffff', a: '#bfefff' },
  { c: '#ff5fc8', a: '#ffe0f2' },
  { c: '#00f0ff', a: '#22d3ee' },
];

const SLIDERS = [
  { key: 'size', label: 'Arm size', min: 14, max: 110, step: 1, fmt: (v) => `${Math.round(v)}px` },
  { key: 'thickness', label: 'Thickness', min: 1, max: 14, step: 1, fmt: (v) => `${Math.round(v)}px` },
  { key: 'gap', label: 'Gap', min: 0, max: 64, step: 1, fmt: (v) => `${Math.round(v)}px` },
  { key: 'dot', label: 'Dot radius', min: 0, max: 16, step: 1, fmt: (v) => `${Math.round(v)}px` },
  { key: 'ring', label: 'Ring radius', min: 4, max: 64, step: 1, fmt: (v) => `${Math.round(v)}px` },
  { key: 'glow', label: 'Neon glow', min: 0, max: 2, step: 0.05, fmt: (v) => Number(v).toFixed(2) },
  { key: 'opacity', label: 'Opacity', min: 0.2, max: 1, step: 0.01, fmt: (v) => `${Math.round(v * 100)}%` },
  { key: 'offsetX', label: 'Shift X', min: -260, max: 260, step: 1, fmt: (v) => `${v > 0 ? '+' : ''}${Math.round(v)}` },
  { key: 'offsetY', label: 'Shift Y', min: -260, max: 260, step: 1, fmt: (v) => `${v > 0 ? '+' : ''}${Math.round(v)}` },
];

let toastTimer = null;

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

async function sendPatch(patch) {
  const res = await window.neon.setConfig(patch);
  if (res && res.ok === false) {
    cfg = res.config;
    hydrate();
    toast(res.msg);
  }
}

function markChips() {
  const box = document.getElementById('styles');
  box.innerHTML = '';
  STYLES.forEach((s) => {
    const b = document.createElement('button');
    b.className = 'chip' + (cfg.style === s.id ? ' active' : '');
    b.textContent = s.label;
    b.onclick = () => { cfg.style = s.id; buildCrosshair(); sendPatch({ style: s.id }); hydrate(); };
    box.appendChild(b);
  });
}

function markSwatches() {
  const box = document.getElementById('presets');
  box.innerHTML = '';
  PRESETS.forEach((p) => {
    const b = document.createElement('button');
    b.className = 'swatch' + (cfg.color === p.c && cfg.accent === p.a ? ' active' : '');
    b.style.background = `linear-gradient(135deg, ${p.c}, ${p.a})`;
    b.title = `${p.c} → ${p.a}`;
    b.onclick = () => { cfg.color = p.c; cfg.accent = p.a; buildCrosshair(); sendPatch({ color: p.c, accent: p.a }); hydrate(); };
    box.appendChild(b);
  });
}

function buildSliders() {
  const box = document.getElementById('sliders');
  box.innerHTML = '<div class="group-title">GEOMETRY</div>';
  SLIDERS.forEach((s) => {
    const row = document.createElement('div');
    row.className = 'slider-row';
    row.innerHTML = `
      <div class="row-top">
        <span class="lbl">${s.label}</span>
        <span class="value">${s.fmt(cfg[s.key])}</span>
      </div>
      <input type="range" min="${s.min}" max="${s.max}" step="${s.step}" value="${cfg[s.key]}" />`;
    const input = row.querySelector('input');
    input.addEventListener('input', () => {
      row.querySelector('.value').textContent = s.fmt(input.value);
      cfg[s.key] = Number(input.value);
      buildCrosshair();
      sendPatch({ [s.key]: Number(input.value) });
    });
    box.appendChild(row);
  });
}

function hydrate() {
  markChips();
  markSwatches();
  buildSliders();

  document.getElementById('color').value = cfg.color;
  document.getElementById('accent').value = cfg.accent;
  document.getElementById('outline').checked = !!cfg.outline;
  document.getElementById('toggleHotkey').value = cfg.toggleHotkey || '';
  document.getElementById('settingsHotkey').value = cfg.settingsHotkey || '';

  const sel = document.getElementById('display');
  sel.value = String(cfg.display);
  if (sel.value !== String(cfg.display)) sel.selectedIndex = 0;

  buildCrosshair();
}

/* ---------------- Panel open / close ---------------- */

function isPanelOpen() {
  return document.body.classList.contains('panel-open');
}

function openPanel() {
  document.body.classList.add('panel-open');
  window.neon.setInteractive(true);
}

function closePanel() {
  document.body.classList.remove('panel-open');
  window.neon.setInteractive(false);
}

function togglePanel() {
  if (isPanelOpen()) closePanel(); else openPanel();
}

/* ---------------- Tray icon ---------------- */

function setTrayIcon() {
  const c = document.createElement('canvas');
  c.width = 32;
  c.height = 32;
  const g = c.getContext('2d');
  g.clearRect(0, 0, 32, 32);

  g.beginPath();
  g.roundRect(1, 1, 30, 30, 8);
  g.fillStyle = '#0d0f1c';
  g.fill();
  g.strokeStyle = 'rgba(0,240,255,0.35)';
  g.lineWidth = 1;
  g.stroke();

  g.lineCap = 'round';
  for (const [w, color] of [[7, 'rgba(0,240,255,0.55)'], [3.2, '#ffffff']]) {
    g.strokeStyle = color;
    g.lineWidth = w;
    g.beginPath();
    g.moveTo(16, 5.5);
    g.lineTo(16, 26.5);
    g.moveTo(5.5, 16);
    g.lineTo(26.5, 16);
    g.stroke();
  }

  g.fillStyle = '#ff2bd6';
  g.beginPath();
  g.arc(16, 16, 2.4, 0, Math.PI * 2);
  g.fill();

  window.neon.setTrayIcon(c.toDataURL());
}

/* ---------------- Init ---------------- */

async function init() {
  const r = await window.neon.getConfig();
  cfg = r.config;
  defaults = r.defaults;

  displays = await window.neon.listDisplays();
  const sel = document.getElementById('display');
  sel.innerHTML = displays.map((d) => `<option value="${d.id}">${d.label}</option>`).join('');

  hydrate();

  document.getElementById('color').addEventListener('input', (e) => {
    cfg.color = e.target.value;
    buildCrosshair();
    sendPatch({ color: e.target.value });
  });
  document.getElementById('accent').addEventListener('input', (e) => {
    cfg.accent = e.target.value;
    buildCrosshair();
    sendPatch({ accent: e.target.value });
  });
  document.getElementById('outline').addEventListener('change', (e) => {
    cfg.outline = e.target.checked;
    buildCrosshair();
    sendPatch({ outline: e.target.checked });
  });
  document.getElementById('display').addEventListener('change', (e) => {
    sendPatch({ display: e.target.value });
  });

  const bindHotkey = (id, key) => {
    document.getElementById(id).addEventListener('change', (e) => {
      sendPatch({ [key]: e.target.value.trim() });
    });
  };
  bindHotkey('toggleHotkey', 'toggleHotkey');
  bindHotkey('settingsHotkey', 'settingsHotkey');

  document.getElementById('btnClose').addEventListener('click', closePanel);
  document.getElementById('btnHide').addEventListener('click', () => {
    closePanel();
    sendPatch({ visible: false });
  });
  document.getElementById('btnReset').addEventListener('click', async () => {
    await sendPatch({ ...defaults, display: cfg.display });
  });
  document.getElementById('btnQuit').addEventListener('click', () => window.neon.quit());

  document.getElementById('stage').addEventListener('click', (e) => {
    if (e.target.id === 'stage' || e.target.classList.contains('scrim')) closePanel();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanel();
  });

  window.neon.onCommand((cmd) => {
    if (cmd === 'toggle-settings') togglePanel();
  });

  window.neon.onConfigChanged((c) => {
    cfg = c;
    hydrate();
    if (!cfg.visible) closePanel();
  });

  setTrayIcon();
}

init();