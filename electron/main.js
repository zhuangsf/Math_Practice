// modify by jx: Electron main process entry file
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fileURLToPath } = require('url');

// modify by jx: Check if running in development mode
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// modify by jx: Create application window
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    // modify by jx: Application icon (optional, can be added later)
    // icon: path.join(__dirname, '../build/icon.ico'),
    title: '小学数学四则运算出题工具'
  });

    // modify by jx: Load application based on environment
  if (isDev) {
    // modify by jx: Development mode - load from Vite dev server
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools(); // modify by jx: Open DevTools in development
  } else {
    // modify by jx: Production mode - load from built files
    // modify by jx: In packaged app, dist folder is at the same level as electron folder
    const distPath = path.join(__dirname, '../dist/index.html');
    mainWindow.loadFile(distPath);
  }

  // modify by jx: Handle window closed event
  mainWindow.on('closed', () => {
    app.quit();
  });
}

// modify by jx: Initialize application when Electron is ready
app.whenReady().then(() => {
  createWindow();

  // modify by jx: Handle macOS window recreation
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// modify by jx: Quit application when all windows are closed (except macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// modify by jx: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
});
