import type { ElectronAPI } from "@electron-toolkit/preload";
import type * as v from "valibot";
import type * as Validation from "~/db/validation";
import type * as Types from "~/types";

declare global {
	interface Window {
		electron: ElectronAPI;
		api: {
			db: {
				companies: {
					createWithAddress: (
						company: Types.CreateCompanyWithAddressInput,
						address: Types.CreateAddressInput,
					) =>
						| Types.CompanyCreateWithAddressResult
						| {
								errors: {
									company: v.FlatErrors<
										typeof Validation.companyCreateWithAddressSchema
									>;
									address: v.FlatErrors<typeof Validation.addressCreateSchema>;
								};
						  };
					updateWithAddress: (
						company: Types.UpdateCompanyWithAddressInput,
						address: Types.UpdateAddressInput,
					) =>
						| Types.CompanyUpdateWithAddressResult
						| {
								errors: {
									company: v.FlatErrors<
										typeof Validation.companyUpdateWithAddressSchema
									>;
									address: v.FlatErrors<typeof Validation.addressUpdateSchema>;
								};
						  };
					get: (
						cursor: string | null,
						paginationType: Types.PaginationType | null,
					) => Types.CompaniesGetResult;
					getById: (companyId: string) => Types.CompanyGetResult;
					delete: (
						companyId: string,
					) =>
						| Types.CompanyDeleteResult
						| { errors: v.FlatErrors<typeof Validation.companyDeleteSchema> };
				};
				customers: {
					createWithAddress: (
						customer: Types.CreateCustomerWithAddressInput,
						address: Types.CreateAddressInput,
					) =>
						| Types.CustomerCreateWithAddressResult
						| {
								errors: {
									customer: v.FlatErrors<
										typeof Validation.customerCreateWithAddressSchema
									>;
									address: v.FlatErrors<typeof Validation.addressCreateSchema>;
								};
						  };
					updateWithAddress: (
						customer: Types.UpdateCustomerWithAddressInput,
						address: Types.UpdateAddressInput,
					) =>
						| Types.CustomerUpdateWithAddressResult
						| {
								errors: {
									customer: v.FlatErrors<
										typeof Validation.customerUpdateWithAddressSchema
									>;
									address: v.FlatErrors<typeof Validation.addressUpdateSchema>;
								};
						  };
					get: (
						cursor: string | null,
						paginationType: Types.PaginationType | null,
					) => Types.CustomersGetResult;
					getById: (customerId: string) => Types.CustomerGetResult;
					delete: (
						customerId: string,
					) =>
						| Types.CustomerDeleteResult
						| { errors: v.FlatErrors<typeof Validation.customerDeleteSchema> };
				};
				taxes: {
					create: (
						tax: Types.CreateTaxInput,
					) =>
						| Types.TaxCreateResult
						| { errors: v.FlatErrors<typeof Validation.taxCreateSchema> };
					get: (
						cursor: string | null,
						paginationType: Types.PaginationType | null,
					) => Types.TaxesGetResult;
					getById: (taxId: string) => Types.TaxGetResult;
					update: (
						tax: Types.UpdateTaxInput,
					) =>
						| Types.TaxUpdateResult
						| { errors: v.FlatErrors<typeof Validation.taxUpdateSchema> };
					delete: (
						taxId: string,
					) =>
						| Types.TaxDeleteResult
						| { errors: v.FlatErrors<typeof Validation.taxDeleteSchema> };
				};
			};
		};
	}
}
