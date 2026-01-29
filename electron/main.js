// modify by jx: Electron main process entry file - simplified version
const { app, BrowserWindow } = require('electron');
const path = require('path');

console.log('Electron starting...');
console.log('Platform:', process.platform);
console.log('isPackaged:', app.isPackaged);

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
    title: '小学数学四则运算出题工具'
  });

  // Load content
  if (app.isPackaged) {
    // Production mode
    const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
    console.log('Loading from:', indexPath);
    mainWindow.loadFile(indexPath);
  } else {
    // Development mode
    console.log('Loading from dev server...');
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    app.quit();
  });
}

app.whenReady().then(() => {
  console.log('App ready, creating window...');
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
