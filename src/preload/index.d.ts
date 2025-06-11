import type { ElectronAPI } from "@electron-toolkit/preload";
import type { InsertTax, SelectTax } from "../db/schema";
import type { ResultSet } from "@libsql/client";

declare global {
	interface Window {
		electron: ElectronAPI;
		api: {
			db: {
				getTaxes: (cursor?: string, pageSize?: number) => Promise<SelectTax[]>;
				getTaxesCount: () => Promise<
					{
						count: number;
					}[]
				>;
				createTax: (tax: InsertTax) => Promise<ResultSet>;
			};
		};
	}
}
