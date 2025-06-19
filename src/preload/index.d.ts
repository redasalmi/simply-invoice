import type { ElectronAPI } from "@electron-toolkit/preload";
import type { ResultSet } from "@libsql/client";
import type {
	InsertTax,
	PaginatedResult,
	PaginationType,
	SelectTax,
} from "@types";

declare global {
	interface Window {
		electron: ElectronAPI;
		api: {
			db: {
				taxes: {
					create: (tax: InsertTax) => Promise<ResultSet>;
					get: (
						cursor: string | null,
						paginationType: PaginationType | null,
					) => Promise<PaginatedResult<SelectTax>>;
				};
			};
		};
	}
}
