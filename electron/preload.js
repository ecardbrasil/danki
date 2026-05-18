const { contextBridge, ipcRenderer } = require('electron');

// ============================================================
//  API segura exposta ao renderizador (front-end)
//  Tudo aqui é controlado e não expõe o Node.js diretamente.
// ============================================================
contextBridge.exposeInMainWorld('electronAPI', {
  // Versão do app
  getVersion: () => ipcRenderer.invoke('get-version'),

  // Navegação controlada pelo menu (ex: Preferências)
  onNavigate: (callback) => {
    ipcRenderer.on('navigate', (_event, route) => callback(route));
  },

  // Abrir links externos de forma segura
  openExternal: (url) => ipcRenderer.invoke('open-external', url),

  // Plataforma do sistema
  platform: process.platform,

  // Informações do sistema
  getSystemInfo: () => ({
    platform: process.platform,
    arch: process.arch,
    electronVersion: process.versions.electron,
    chromeVersion: process.versions.chrome,
    nodeVersion: process.versions.node,
  }),
});