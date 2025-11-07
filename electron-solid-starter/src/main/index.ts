import { app, BrowserWindow } from 'electron';
import path from 'node:path';

import started from 'electron-squirrel-startup';

const isSquirrelEvent = started;

const createMainWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      sandbox: false
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    await mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    return;
  }

  const indexHtmlPath = path.join(
    __dirname,
    `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`
  );
  await mainWindow.loadFile(indexHtmlPath);
};

const registerAppLifecycle = () => {
  app.on('window-all-closed', () => {
    if (process.platform === 'darwin') {
      return;
    }

    app.quit();
  });

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length > 0) {
      return;
    }

    await createMainWindow();
  });
};

const bootstrap = async () => {
  if (isSquirrelEvent) {
    app.quit();
    return;
  }

  await app.whenReady();
  await createMainWindow();
  registerAppLifecycle();
};

void bootstrap();
