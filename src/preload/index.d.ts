import type { ElectronAPI } from "@electron-toolkit/preload";
import type { taxesTable } from "../db/schema";

declare global {
	interface Window {
		electron: ElectronAPI;
		api: {
			db: {
				createTax: (tax: typeof taxesTable.$inferInsert) => Promise<void>;
				getAllTaxes: () => Promise<(typeof taxesTable.$inferSelect)[]>;
			};
		};
	}
}
