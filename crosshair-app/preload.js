const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('neon', {
  getConfig: () => ipcRenderer.invoke('cfg:get'),
  setConfig: (patch) => ipcRenderer.invoke('cfg:set', patch),
  listDisplays: () => ipcRenderer.invoke('displays:list'),
  setInteractive: (value) => ipcRenderer.send('app:interactive', !!value),
  setTrayIcon: (dataUrl) => ipcRenderer.send('tray:icon', dataUrl),
  quit: () => ipcRenderer.send('app:quit'),
  onCommand: (cb) => ipcRenderer.on('cmd', (_e, cmd) => cb(cmd)),
  onConfigChanged: (cb) => ipcRenderer.on('cfg:changed', (_e, cfg) => cb(cfg)),
});