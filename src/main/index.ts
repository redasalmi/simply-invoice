import { join } from "node:path";
import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { app, BrowserWindow, ipcMain, shell } from "electron";
import {
	installExtension,
	REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
import * as v from "valibot";
import { migrateDb } from "~/db/migrate";
import {
	addressCreateSchema,
	companyCreateWithAddressSchema,
	taxCreateSchema,
	taxDeleteSchema,
	taxUpdateSchema,
} from "~/db/validation";
import {
	createCompanyWithAddress,
	getCompanies,
} from "~/main/services/companies";
import {
	createTax,
	deleteTax,
	getTax,
	getTaxes,
	updateTax,
} from "~/main/services/taxes";
import icon from "~/resources/icon.png?asset";
import type {
	CreateAddressInput,
	CreateCompanyWithAddressInput,
	CreateTaxInput,
	PaginationType,
	UpdateTaxInput,
} from "~/types";

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

// TODO: remove this once I have a proper manner to handle it
if (process.platform === "linux") {
	app.commandLine.appendSwitch("gtk-version", "3");
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
	await migrateDb();

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

	ipcMain.handle(
		"get-companies",
		(_, cursor: string | null, paginationType: PaginationType | null) => {
			return getCompanies(cursor, paginationType);
		},
	);

	ipcMain.handle(
		"create-company-with-address",
		(
			_,
			company: CreateCompanyWithAddressInput,
			address: CreateAddressInput,
		) => {
			let companyErrors: v.FlatErrors<typeof companyCreateWithAddressSchema> =
				{};
			let addressErrors: v.FlatErrors<typeof addressCreateSchema> = {};

			const parsedCompany = v.safeParse(
				companyCreateWithAddressSchema,
				company,
			);
			if (!parsedCompany.success) {
				companyErrors = v.flatten(parsedCompany.issues);
			}

			const parsedAddress = v.safeParse(addressCreateSchema, address);
			if (!parsedAddress.success) {
				addressErrors = v.flatten(parsedAddress.issues);
			}

			if (
				Object.keys(companyErrors).length ||
				Object.keys(addressErrors).length
			) {
				return {
					errors: {
						company: companyErrors,
						address: addressErrors,
					},
				};
			}

			return createCompanyWithAddress(
				parsedCompany.output as CreateCompanyWithAddressInput,
				parsedAddress.output as CreateAddressInput,
			);
		},
	);

	ipcMain.handle(
		"get-taxes",
		(_, cursor: string | null, paginationType: PaginationType | null) => {
			return getTaxes(cursor, paginationType);
		},
	);

	ipcMain.handle("get-tax", (_, taxId: string) => {
		return getTax(taxId);
	});

	ipcMain.handle("create-tax", (_, tax: CreateTaxInput) => {
		const parsedData = v.safeParse(taxCreateSchema, tax);
		if (!parsedData.success) {
			return {
				errors: v.flatten(parsedData.issues),
			};
		}

		return createTax(parsedData.output);
	});

	ipcMain.handle("update-tax", (_, tax: UpdateTaxInput) => {
		const parsedData = v.safeParse(taxUpdateSchema, tax);
		if (!parsedData.success) {
			return {
				errors: v.flatten(parsedData.issues),
			};
		}

		return updateTax(parsedData.output);
	});

	ipcMain.handle("delete-tax", (_, taxId: string) => {
		const parsedData = v.safeParse(taxDeleteSchema, taxId);
		if (!parsedData.success) {
			return {
				errors: v.flatten(parsedData.issues),
			};
		}

		return deleteTax(parsedData.output);
	});

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
