const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const { THEMES, buildCss } = require('./themes');

const CFG = path.join(app.getPath('userData'), 'styles.json');
let cfg = { theme: 'blue', customCss: '', onTop: false };
try { cfg = { ...cfg, ...JSON.parse(fs.readFileSync(CFG, 'utf8')) }; } catch (e) {}
const save = () => { try { fs.writeFileSync(CFG, JSON.stringify(cfg)); } catch (e) {} };

let win, cssKey = null, customKey = null;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

async function applyStyles() {
  if (!win || win.isDestroyed()) return;
  const wc = win.webContents;
  try { if (cssKey) await wc.removeInsertedCSS(cssKey); } catch (e) {}
  try { if (customKey) await wc.removeInsertedCSS(customKey); } catch (e) {}
  cssKey = customKey = null;
  const t = THEMES.find(x => x.id === cfg.theme);
  const css = buildCss(t);
  if (css) cssKey = await wc.insertCSS(css);
  if (cfg.customCss) {
    try { customKey = await wc.insertCSS(fs.readFileSync(cfg.customCss, 'utf8')); } catch (e) {}
  }
}
function setTheme(id) { cfg.theme = id; save(); applyStyles(); buildMenu(); }
function nextTheme() { const i = THEMES.findIndex(x => x.id === cfg.theme); setTheme(THEMES[(i + 1) % THEMES.length].id); }

function buildMenu() {
  const tpl = [
    { label: 'Styl', submenu: [
      ...THEMES.map(t => ({ label: t.name, type: 'radio', checked: cfg.theme === t.id, click: () => setTheme(t.id) })),
      { type: 'separator' },
      { label: 'Następny styl', accelerator: 'CmdOrCtrl+Shift+T', click: nextTheme },
      { label: 'Własny plik CSS...', click: async () => {
          const r = await dialog.showOpenDialog(win, { filters: [{ name: 'CSS', extensions: ['css'] }], properties: ['openFile'] });
          if (!r.canceled && r.filePaths[0]) { cfg.customCss = r.filePaths[0]; save(); applyStyles(); } } },
      { label: 'Usuń własny CSS', click: () => { cfg.customCss = ''; save(); applyStyles(); } },
    ] },
    { label: 'Okno', submenu: [
      { label: 'Zawsze na wierzchu', type: 'checkbox', checked: cfg.onTop, click: (m) => { cfg.onTop = m.checked; save(); win.setAlwaysOnTop(cfg.onTop); } },
      { label: 'Przeładuj', accelerator: 'CmdOrCtrl+R', click: () => win.webContents.reload() },
      { label: 'Pełny ekran', accelerator: 'F11', click: () => win.setFullScreen(!win.isFullScreen()) },
      { role: 'quit', label: 'Zamknij' },
    ] },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(tpl));
}

function createWindow() {
  win = new BrowserWindow({ width: 1280, height: 800, minWidth: 940, minHeight: 500, backgroundColor: '#0d2240', title: 'Discord Styles',
    alwaysOnTop: cfg.onTop, webPreferences: { contextIsolation: true, sandbox: true } });
  win.webContents.setUserAgent(UA);
  win.loadURL('https://discord.com/app');
  win.webContents.on('did-finish-load', applyStyles);
  win.webContents.on('did-navigate-in-page', applyStyles);
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
  buildMenu();
}
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
