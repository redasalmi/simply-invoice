import type {
	taxCreateSchema,
	taxDeleteSchema,
	taxUpdateSchema,
} from "@db/validation";
import type { ElectronAPI } from "@electron-toolkit/preload";
import type {
	CreateTaxInput,
	PaginationType,
	TaxCreateResult,
	TaxDeleteResult,
	TaxesGetResult,
	TaxGetResult,
	TaxUpdateResult,
	UpdateTaxInput,
} from "@types";
import type * as v from "valibot";

declare global {
	interface Window {
		electron: ElectronAPI;
		api: {
			db: {
				taxes: {
					create: (
						tax: CreateTaxInput,
					) =>
						| TaxCreateResult
						| { errors: v.FlatErrors<typeof taxCreateSchema> };
					get: (
						cursor: string | null,
						paginationType: PaginationType | null,
					) => TaxesGetResult;
					getById: (taxId: string) => TaxGetResult;
					update: (
						tax: UpdateTaxInput,
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
