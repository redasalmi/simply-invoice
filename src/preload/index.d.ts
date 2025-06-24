import type { ElectronAPI } from "@electron-toolkit/preload";
import type * as v from "valibot";
import type {
	addressCreateSchema,
	companyCreateWithAddressSchema,
	taxCreateSchema,
	taxDeleteSchema,
	taxUpdateSchema,
} from "~/db/validation";
import type {
	CompaniesGetResult,
	CompanyCreateWithAddressResult,
	CreateAddressInput,
	CreateCompanyWithAddressInput,
	CreateTaxInput,
	PaginationType,
	TaxCreateResult,
	TaxDeleteResult,
	TaxesGetResult,
	TaxGetResult,
	TaxUpdateResult,
	UpdateTaxInput,
} from "~/types";

declare global {
	interface Window {
		electron: ElectronAPI;
		api: {
			db: {
				companies: {
					createWithAddress: (
						company: CreateCompanyWithAddressInput,
						address: CreateAddressInput,
					) =>
						| CompanyCreateWithAddressResult
						| {
								errors: {
									company: v.FlatErrors<typeof companyCreateWithAddressSchema>;
									address: v.FlatErrors<typeof addressCreateSchema>;
								};
						  };
					get: (
						cursor: string | null,
						paginationType: PaginationType | null,
					) => CompaniesGetResult;
				};
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
