import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";
import type {
	CreateAddressInput,
	CreateCompanyWithAddressInput,
	CreateCustomerWithAddressInput,
	CreateTaxInput,
	PaginationType,
	UpdateAddressInput,
	UpdateCompanyWithAddressInput,
	UpdateCustomerWithAddressInput,
	UpdateTaxInput,
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
			get: (cursor: string | null, paginationType: PaginationType | null) => {
				return ipcRenderer.invoke("get-companies", cursor, paginationType);
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
			get: (cursor: string | null, paginationType: PaginationType | null) => {
				return ipcRenderer.invoke("get-customers", cursor, paginationType);
			},
			getById: (customerId: string) => {
				return ipcRenderer.invoke("get-customer", customerId);
			},
			delete: (customerId: string) => {
				return ipcRenderer.invoke("delete-customer", customerId);
			},
		},
		taxes: {
			create: (tax: CreateTaxInput) => {
				return ipcRenderer.invoke("create-tax", tax);
			},
			get: (cursor: string | null, paginationType: PaginationType | null) => {
				return ipcRenderer.invoke("get-taxes", cursor, paginationType);
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
	// @ts-ignore (define in dts)
	window.electron = electronAPI;
	// @ts-ignore (define in dts)
	window.api = api;
}
