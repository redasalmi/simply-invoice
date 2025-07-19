import { join } from "node:path";
import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { app, BrowserWindow, shell } from "electron";
import {
	installExtension,
	REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
import { migrateDb } from "~/db/migrate";
import { registerCompaniesIcpHandlers } from "~/main/services/companies";
import { registerCustomersIcpHandles } from "~/main/services/customers";
import { registerServicesIcpHandlers } from "~/main/services/services";
import { registerTaxesIcpHandlers } from "~/main/services/taxes";
import {
	createDefaultUserSettings,
	registerUserSettingsIcpHandlers,
} from "~/main/services/user-settings";
import icon from "~/resources/icon.png?asset";

function createWindow() {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 1920,
		height: 1080,
		show: false,
		autoHideMenuBar: true,
		...(process.platform === "linux" ? { icon } : {}),
		webPreferences: {
			preload: join(__dirname, "../preload/index.js"),
			sandbox: false,
		},
	});

	mainWindow.on("ready-to-show", () => {
		mainWindow.show();
	});

	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url);
		return { action: "deny" };
	});

	// HMR for renderer base on electron-vite cli.
	// Load the remote URL for development or the local html file for production.
	if (is.dev && process.env.ELECTRON_RENDERER_URL) {
		mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
	} else {
		mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
	}

	if (is.dev) {
		mainWindow.webContents.openDevTools({ mode: "right" });
	}
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
	await migrateDb();
	await createDefaultUserSettings();

	if (is.dev) {
		try {
			const extension = await installExtension(REACT_DEVELOPER_TOOLS);
			console.log(`Added Extension:  ${extension.name}`);
		} catch (err) {
			console.error("An error occurred: ", err);
		}
	}

	// Set app user model id for windows
	electronApp.setAppUserModelId("com.electron");

	// Default open or close DevTools by F12 in development
	// and ignore CommandOrControl + R in production.
	// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
	app.on("browser-window-created", (_, window) => {
		optimizer.watchWindowShortcuts(window);
	});

	registerCompaniesIcpHandlers();
	registerCustomersIcpHandles();
	registerServicesIcpHandlers();
	registerTaxesIcpHandlers();
	registerUserSettingsIcpHandlers();
	createWindow();

	app.on("activate", async () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
