import type {
	taxDeleteSchema,
	taxInsertSchema,
	taxUpdateSchema,
} from "@db/validation";
import type { ElectronAPI } from "@electron-toolkit/preload";
import type {
	InsertTax,
	PaginationType,
	TaxCreateResult,
	TaxDeleteResult,
	TaxesGetResult,
	TaxGetResult,
	TaxUpdateResult,
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
					) =>
						| TaxCreateResult
						| { errors: v.FlatErrors<typeof taxInsertSchema> };
					get: (
						cursor: string | null,
						paginationType: PaginationType | null,
					) => TaxesGetResult;
					getById: (taxId: string) => TaxGetResult;
					update: (
						tax: UpdateTax,
					) =>
						| TaxUpdateResult
						| { errors: v.FlatErrors<typeof taxUpdateSchema> };
					delete: (
						taxId: string,
					) =>
						| TaxDeleteResult
						| { errors: v.FlatErrors<typeof taxDeleteSchema> };
				};
			};
		};
	}
}
