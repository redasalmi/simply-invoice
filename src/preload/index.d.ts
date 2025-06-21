import type { taxInsertSchema, taxUpdateSchema } from "@db/validation";
import type { ElectronAPI } from "@electron-toolkit/preload";
import type {
	InsertTax,
	PaginatedResult,
	PaginationType,
	SelectTax,
	UpdateTax,
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
						SelectTax | { errors: v.FlatErrors<typeof taxInsertSchema> }
					>;
					get: (
						cursor: string | null,
						paginationType: PaginationType | null,
					) => Promise<PaginatedResult<SelectTax>>;
					getOne: (taxId: string) => Promise<SelectTax | undefined>;
					update: (
						tax: UpdateTax,
					) => Promise<
						SelectTax | { errors: v.FlatErrors<typeof taxUpdateSchema> }
					>;
				};
			};
		};
	}
}
