const { app, BrowserWindow, Menu, shell, ipcMain, Tray } = require('electron');
const path = require('path');
const fs = require('fs');

// ============================================================
//  Configurações
// ============================================================
let mainWindow = null;
let tray = null;

// ============================================================
//  Janela Principal
// ============================================================
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    title: 'Danki AI',
    backgroundColor: '#0a0a0f',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // Carrega o index.html local
  const indexPath = path.join(__dirname, '..', 'index.html');
  mainWindow.loadFile(indexPath);

  // Exibe a janela quando estiver pronta (evita flash branco)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Abre links externos no navegador padrão
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ============================================================
//  Menu de Aplicativo
// ============================================================
function createAppMenu() {
  const template = [
    {
      label: 'Danki AI',
      submenu: [
        { label: 'Sobre o Danki AI', role: 'about' },
        { type: 'separator' },
        {
          label: 'Preferências',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('navigate', '/profile');
            }
          },
        },
        { type: 'separator' },
        { label: 'Sair', accelerator: 'CmdOrCtrl+Q', role: 'quit' },
      ],
    },
    {
      label: 'Editar',
      submenu: [
        { label: 'Desfazer', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Refazer', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Recortar', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copiar', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Colar', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: 'Selecionar Tudo', accelerator: 'CmdOrCtrl+A', role: 'selectAll' },
      ],
    },
    {
      label: 'Exibir',
      submenu: [
        { label: 'Recarregar', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'Ferramentas do Desenvolvedor', accelerator: 'F12', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Zoom +', accelerator: 'CmdOrCtrl+=', role: 'zoomIn' },
        { label: 'Zoom -', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { label: 'Restaurar Zoom', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { type: 'separator' },
        { label: 'Tela Cheia', accelerator: 'F11', role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Repositório no GitHub',
          click: () => shell.openExternal('https://github.com/ecardbrasil/danki'),
        },
        { type: 'separator' },
        {
          label: 'Ferramentas do Desenvolvedor',
          accelerator: 'CmdOrCtrl+Shift+I',
          role: 'toggleDevTools',
        },
      ],
    },
  ];

  // No macOS, precisamos do submenu "window"
  if (process.platform === 'darwin') {
    template.splice(3, 0, {
      label: 'Janela',
      submenu: [
        { label: 'Minimizar', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
        { label: 'Fechar', accelerator: 'CmdOrCtrl+W', role: 'close' },
      ],
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// ============================================================
//  Bandeja do Sistema (função placeholder)
// ============================================================
function createTray() {
  // A bandeja do sistema pode ser ativada futuramente.
  // Basta criar um arquivo icon-tray.png em electron/assets/
  // e descomentar o código abaixo.
  /*
  const trayIconPath = path.join(__dirname, 'assets', 'icon-tray.png');
  if (fs.existsSync(trayIconPath)) {
    tray = new Tray(trayIconPath);
    tray.setToolTip('Danki AI — Flashcards inteligentes');
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Abrir Danki AI', click: () => { if (mainWindow) mainWindow.show(); } },
      { type: 'separator' },
      { label: 'Sair', click: () => { app.quit(); } },
    ]);
    tray.setContextMenu(contextMenu);
    tray.on('click', () => { if (mainWindow) mainWindow.show(); });
  }
  */
}

// ============================================================
//  IPC Handlers (comunicação segura com o front-end)
// ============================================================
function registerIpcHandlers() {
  ipcMain.handle('get-version', () => {
    return app.getVersion();
  });

  ipcMain.handle('open-external', (_event, url) => {
    if (typeof url === 'string' && (url.startsWith('https:') || url.startsWith('http:'))) {
      shell.openExternal(url);
    }
  });
}

// ============================================================
//  Eventos do App
// ============================================================
app.whenReady().then(() => {
  registerIpcHandlers();
  createAppMenu();
  createMainWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});