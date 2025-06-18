import type { ElectronAPI } from "@electron-toolkit/preload";
import type { ResultSet } from "@libsql/client";
import type { InsertTax, SelectTax } from "@db/schema";

declare global {
	interface Window {
		electron: ElectronAPI;
		api: {
			db: {
				taxes: {
					create: (tax: InsertTax) => Promise<ResultSet>;
					get: (cursor?: string, pageSize?: number) => Promise<SelectTax[]>;
					count: () => Promise<
						{
							count: number;
						}[]
					>;
				};
			};
		};
	}
}
