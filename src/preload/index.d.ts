import type { taxInsertSchema } from "@db/validation";
import type { ElectronAPI } from "@electron-toolkit/preload";
import type { ResultSet } from "@libsql/client";
import type {
	InsertTax,
	PaginatedResult,
	PaginationType,
	SelectTax,
} from "@types";
import type * as v from "valibot";

declare global {
	interface Window {
		electron: ElectronAPI;
		api: {
			db: {
				taxes: {
					create: (
						tax: InsertTax,
					) => Promise<
						ResultSet | { errors: v.FlatErrors<typeof taxInsertSchema> }
					>;
					get: (
						cursor: string | null,
						paginationType: PaginationType | null,
					) => Promise<PaginatedResult<SelectTax>>;
				};
			};
		};
	}
}
