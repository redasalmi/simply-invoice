import { type ElectronAPI, electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";
import type {
	CreateAddressInput,
	CreateCompanyWithAddressInput,
	CreateCustomerWithAddressInput,
	CreateServiceInput,
	CreateTaxInput,
	PaginationType,
	UpdateAddressInput,
	UpdateCompanyWithAddressInput,
	UpdateCustomerWithAddressInput,
	UpdateServiceInput,
	UpdateTaxInput,
	UpdateUserSettingInput,
} from "~/types";

// Custom APIs for renderer
const api = {
	db: {
		companies: {
			createWithAddress: (
				company: CreateCompanyWithAddressInput,
				address: CreateAddressInput,
			) => {
				return ipcRenderer.invoke(
					"create-company-with-address",
					company,
					address,
				);
			},
			updateWithAddress: (
				company: UpdateCompanyWithAddressInput,
				address: UpdateAddressInput,
			) => {
				return ipcRenderer.invoke(
					"update-company-with-address",
					company,
					address,
				);
			},
			get: (
				cursor: string | null,
				paginationType: PaginationType | null,
				itemsPerPage: number,
			) => {
				return ipcRenderer.invoke(
					"get-companies",
					cursor,
					paginationType,
					itemsPerPage,
				);
			},
			getById: (companyId: string) => {
				return ipcRenderer.invoke("get-company", companyId);
			},
			delete: (companyId: string) => {
				return ipcRenderer.invoke("delete-company", companyId);
			},
		},
		customers: {
			createWithAddress: (
				customer: CreateCustomerWithAddressInput,
				address: CreateAddressInput,
			) => {
				return ipcRenderer.invoke(
					"create-customer-with-address",
					customer,
					address,
				);
			},
			updateWithAddress: (
				customer: UpdateCustomerWithAddressInput,
				address: UpdateAddressInput,
			) => {
				return ipcRenderer.invoke(
					"update-customer-with-address",
					customer,
					address,
				);
			},
			get: (
				cursor: string | null,
				paginationType: PaginationType | null,
				itemsPerPage: number,
			) => {
				return ipcRenderer.invoke(
					"get-customers",
					cursor,
					paginationType,
					itemsPerPage,
				);
			},
			getById: (customerId: string) => {
				return ipcRenderer.invoke("get-customer", customerId);
			},
			delete: (customerId: string) => {
				return ipcRenderer.invoke("delete-customer", customerId);
			},
		},
		services: {
			create: (service: CreateServiceInput) => {
				return ipcRenderer.invoke("create-service", service);
			},
			get: (
				cursor: string | null,
				paginationType: PaginationType | null,
				itemsPerPage: number,
			) => {
				return ipcRenderer.invoke(
					"get-services",
					cursor,
					paginationType,
					itemsPerPage,
				);
			},
			getById: (serviceId: string) => {
				return ipcRenderer.invoke("get-service", serviceId);
			},
			update: (service: UpdateServiceInput) => {
				return ipcRenderer.invoke("update-service", service);
			},
			delete: (serviceId: string) => {
				return ipcRenderer.invoke("delete-service", serviceId);
			},
		},
		taxes: {
			create: (tax: CreateTaxInput) => {
				return ipcRenderer.invoke("create-tax", tax);
			},
			get: (
				cursor: string | null,
				paginationType: PaginationType | null,
				itemsPerPage: number,
			) => {
				return ipcRenderer.invoke(
					"get-taxes",
					cursor,
					paginationType,
					itemsPerPage,
				);
			},
			getById: (taxId: string) => {
				return ipcRenderer.invoke("get-tax", taxId);
			},
			update: (tax: UpdateTaxInput) => {
				return ipcRenderer.invoke("update-tax", tax);
			},
			delete: (taxId: string) => {
				return ipcRenderer.invoke("delete-tax", taxId);
			},
		},
		userSettings: {
			get: () => {
				return ipcRenderer.invoke("get-user-settings");
			},
			update: (userSetting: UpdateUserSettingInput) => {
				return ipcRenderer.invoke("update-user-setting", userSetting);
			},
		},
	},
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld("electron", electronAPI);
		contextBridge.exposeInMainWorld("api", api);
	} catch (error) {
		console.error(error);
	}
} else {
	window.electron = electronAPI;
	window.api = api;
}

declare global {
	interface Window {
		electron: ElectronAPI;
		api: typeof api;
	}
}
