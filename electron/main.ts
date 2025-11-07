import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { existsSync } from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '../');

export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');
const isDev = !existsSync(path.join(RENDERER_DIST, 'index.html'));
export const VITE_DEV_SERVER_URL = isDev
	? 'http://localhost:5173'
	: undefined;

process.env.VITE_PUBLIC = isDev
	? path.join(process.env.APP_ROOT, 'public')
	: RENDERER_DIST;

// Disable GPU Acceleration for Windows 7
if (process.platform === 'win32') {
	app.disableHardwareAcceleration();
}

let win: BrowserWindow | null = null;
const preload = path.join(__dirname, 'preload.js');
const indexHtml = path.join(RENDERER_DIST, 'index.html');

async function createWindow() {
	win = new BrowserWindow({
		title: 'Electron + SolidJS App',
		icon: path.join(process.env.VITE_PUBLIC || '', 'favicon.ico'),
		width: 1200,
		height: 800,
		webPreferences: {
			preload,
			nodeIntegration: false,
			contextIsolation: true,
		},
	});

	// Test active push message to Renderer-process
	win.webContents.on('did-finish-load', () => {
		win?.webContents.send('main-process-message', new Date().toLocaleString());
	});

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL);
		// Open devTool if the app is not packaged
		win.webContents.openDevTools();
	} else {
		win.loadFile(indexHtml);
	}
}

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
		win = null;
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.whenReady().then(createWindow);
