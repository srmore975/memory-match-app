const { app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu, nativeImage, screen } = require('electron');
const path = require('path');
const fs = require('fs');

app.setName('CrossOnScreen');
app.setAppUserModelId('com.crossonscreen.overlay');

let win = null;
let tray = null;
let interactive = false;

const DEFAULT_CONFIG = {
  visible: true,
  style: 'cross-dot',
  color: '#00f0ff',
  accent: '#ff2bd6',
  size: 34,
  thickness: 4,
  gap: 8,
  dot: 4,
  ring: 16,
  glow: 1,
  opacity: 1,
  offsetX: 0,
  offsetY: 0,
  outline: true,
  display: 'primary',
  toggleHotkey: 'CommandOrControl+Shift+F11',
  settingsHotkey: 'CommandOrControl+Shift+F12',
};

const CONFIG_PATH = () => path.join(app.getPath('userData'), 'neon-crosshair.json');

let config = { ...DEFAULT_CONFIG };

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH())) {
      const raw = JSON.parse(fs.readFileSync(CONFIG_PATH(), 'utf8'));
      config = { ...DEFAULT_CONFIG, ...raw };
    }
  } catch (err) {
    config = { ...DEFAULT_CONFIG };
  }
}

function saveConfig() {
  try {
    fs.writeFileSync(CONFIG_PATH(), JSON.stringify(config, null, 2), 'utf8');
  } catch (err) { /* non-fatal */ }
}

function currentDisplay() {
  const all = screen.getAllDisplays();
  if (config.display === 'primary') return screen.getPrimaryDisplay();
  return all.find((d) => String(d.id) === String(config.display)) || screen.getPrimaryDisplay();
}

function applyDisplayBounds() {
  if (!win) return;
  const b = currentDisplay().bounds;
  win.setBounds({ x: b.x, y: b.y, width: b.width, height: b.height });
}

function setInteractive(value) {
  interactive = !!value;
  if (!win) return;
  win.setIgnoreMouseEvents(!interactive, { forward: true });
  if (!interactive && win.isVisible()) win.blur();
}

function applyVisible() {
  if (!win) return;
  if (config.visible) {
    if (!win.isVisible()) win.show();
    if (!interactive) win.blur();
  } else {
    win.hide();
  }
}

function createWindow() {
  const b = currentDisplay().bounds;
  win = new BrowserWindow({
    x: b.x,
    y: b.y,
    width: b.width,
    height: b.height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    hasShadow: false,
    skipTaskbar: true,
    enableLargerThanScreen: true,
    show: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.setAlwaysOnTop(true, 'screen-saver');
  win.setIgnoreMouseEvents(true, { forward: true });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  win.once('ready-to-show', () => {
    if (config.visible) win.show();
    if (!interactive) win.blur();
  });
  win.on('closed', () => { win = null; });
}

function send(cmd, payload) {
  if (win && !win.isDestroyed()) win.webContents.send('cmd', cmd, payload);
}

function bindHandlers() {
  globalShortcut.unregisterAll();
  const t = globalShortcut.register(config.toggleHotkey, () => toggleOverlay());
  const s = globalShortcut.register(config.settingsHotkey, () => toggleSettings());
  return { t, s };
}

function toggleOverlay() {
  config.visible = !config.visible;
  saveConfig();
  applyVisible();
  if (win && !win.isDestroyed()) win.webContents.send('cfg:changed', config);
}

function toggleSettings() {
  if (!win || win.isDestroyed()) return;
  if (!config.visible) { config.visible = true; saveConfig(); }
  applyVisible();
  send('toggle-settings');
}

function buildTray() {
  tray = new Tray(nativeImage.createEmpty());
  tray.setToolTip('CrossOnScreen Overlay');
  refreshTrayMenu();
  tray.on('double-click', () => toggleOverlay());
}

function refreshTrayMenu() {
  if (!tray) return;
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Toggle overlay', click: () => toggleOverlay() },
    { label: 'Overlay settings', click: () => toggleSettings() },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() },
  ]));
}

app.whenReady().then(() => {
  loadConfig();

  ipcMain.handle('cfg:get', () => ({ config, defaults: DEFAULT_CONFIG }));
  ipcMain.handle('cfg:set', (_e, patch) => {
    const prev = { ...config };
    for (const key of Object.keys(DEFAULT_CONFIG)) {
      if (patch && patch[key] !== undefined) config[key] = patch[key];
    }
    if (String(config.toggleHotkey).trim() === '') config.toggleHotkey = prev.toggleHotkey;
    if (String(config.settingsHotkey).trim() === '') config.settingsHotkey = prev.settingsHotkey;
    const { t, s } = bindHandlers();
    if (!t || !s) {
      config = prev;
      bindHandlers();
      return { ok: false, msg: 'Hotkey registration failed — pick unused keys.', config };
    }
    saveConfig();
    applyVisible();
    if (patch && patch.display !== undefined) applyDisplayBounds();
    if (win && !win.isDestroyed()) win.webContents.send('cfg:changed', config);
    return { ok: true, config };
  });

  ipcMain.on('app:interactive', (_e, value) => setInteractive(value));
  ipcMain.on('app:quit', () => app.quit());
  ipcMain.on('tray:icon', (_e, dataUrl) => {
    if (!tray) return;
    const img = nativeImage.createFromDataURL(dataUrl);
    if (!img.isEmpty()) tray.setImage(img);
  });

  ipcMain.handle('displays:list', () => {
    const primary = screen.getPrimaryDisplay();
    const all = [
      { id: 'primary', label: 'Primary display' },
      ...screen.getAllDisplays().map((d) => ({
        id: String(d.id),
        label: `Display ${d.id} · ${d.size.width}×${d.size.height}${d.id === primary.id ? ' (primary)' : ''}`,
      })),
    ];
    return all.filter((d, i, arr) => i === 0 || arr.findIndex((x) => x.id === d.id) === i);
  });

  bindHandlers();
  createWindow();
  buildTray();

  screen.on('display-added', applyDisplayBounds);
  screen.on('display-removed', applyDisplayBounds);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  app.quit();
});