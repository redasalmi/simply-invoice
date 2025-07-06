import type { ElectronAPI } from "@electron-toolkit/preload";
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
									company: Types.CompanyCreateWithAddressFlatErrors;
									address: Types.AddressCreateFlatErrors;
								};
						  };
					updateWithAddress: (
						company: Types.UpdateCompanyWithAddressInput,
						address: Types.UpdateAddressInput,
					) =>
						| Types.CompanyUpdateWithAddressResult
						| {
								errors: {
									company: Types.CompanyUpdateWithAddressFlatErrors;
									address: Types.AddressUpdateFlatErrors;
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
						| { errors: Types.CompanyDeleteFlatErrors };
				};
				customers: {
					createWithAddress: (
						customer: Types.CreateCustomerWithAddressInput,
						address: Types.CreateAddressInput,
					) =>
						| Types.CustomerCreateWithAddressResult
						| {
								errors: {
									customer: Types.CustomerCreateWithAddressFlatErrors;
									address: Types.AddressCreateFlatErrors;
								};
						  };
					updateWithAddress: (
						customer: Types.UpdateCustomerWithAddressInput,
						address: Types.UpdateAddressInput,
					) =>
						| Types.CustomerUpdateWithAddressResult
						| {
								errors: {
									customer: Types.CustomerUpdateWithAddressFlatErrors;
									address: Types.AddressUpdateFlatErrors;
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
						| { errors: Types.CustomerDeleteFlatErrors };
				};
				services: {
					create: (
						service: Types.CreateServiceInput,
					) =>
						| Types.ServiceCreateResult
						| { errors: Types.ServiceCreateFlatErrors };
					get: (
						cursor: string | null,
						paginationType: Types.PaginationType | null,
					) => Types.ServicesGetResult;
					getById: (serviceId: string) => Types.ServiceGetResult;
					update: (
						service: Types.UpdateServiceInput,
					) =>
						| Types.ServiceUpdateResult
						| { errors: Types.ServiceUpdateFlatErrors };
					delete: (
						serviceId: string,
					) =>
						| Types.ServiceDeleteResult
						| { errors: Types.ServiceDeleteFlatErrors };
				};
				taxes: {
					create: (
						tax: Types.CreateTaxInput,
					) => Types.TaxCreateResult | { errors: Types.TaxCreateFlatErrors };
					get: (
						cursor: string | null,
						paginationType: Types.PaginationType | null,
					) => Types.TaxesGetResult;
					getById: (taxId: string) => Types.TaxGetResult;
					update: (
						tax: Types.UpdateTaxInput,
					) => Types.TaxUpdateResult | { errors: Types.TaxUpdateFlatErrors };
					delete: (
						taxId: string,
					) => Types.TaxDeleteResult | { errors: Types.TaxDeleteFlatErrors };
				};
				userSettings: {
					get: () => Types.UserSettingsGetResult;
					update: (
						userSetting: Types.UpdateUserSettingInput,
					) =>
						| Types.UserSettingsUpdateResult
						| { errors: Types.UserSettingsUpdateFlatErrors };
				};
			};
		};
	}
}
