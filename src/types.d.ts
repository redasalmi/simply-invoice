import type * as v from "valibot";
import type {
	addressesTable,
	companiesTable,
	customersTable,
	taxesTable,
} from "./db/schema";
import type * as Validation from "./db/validation";
import type {
	createCompanyWithAddress,
	deleteCompany,
	getCompanies,
	getCompany,
	updateCompanyWithAddress,
} from "./main/services/companies";
import type {
	createCustomerWithAddress,
	deleteCustomer,
	getCustomer,
	getCustomers,
	updateCustomerWithAddress,
} from "./main/services/customers";
import type {
	createService,
	deleteService,
	getService,
	getServices,
	updateService,
} from "./main/services/services";
import type {
	createTax,
	deleteTax,
	getTax,
	getTaxes,
	updateTax,
} from "./main/services/taxes";
import type { paginationTypes } from "./renderer/src/utils/getPaginationParams";

// pagination types
export type PaginationType = keyof typeof paginationTypes;

export interface PageInfo {
	endCursor?: string;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startCursor?: string;
}

export interface PaginatedResult<T> {
	items: Array<T>;
	total: number;
	pageInfo: PageInfo;
}

// address types
export type Address = typeof addressesTable.$inferSelect;
export type CreateAddressInput = typeof addressesTable.$inferInsert;
export interface UpdateAddressInput extends CreateAddressInput {
	addressId: string;
}
export type AddressCreateFlatErrors = v.FlatErrors<
	typeof Validation.addressCreateSchema
>;
export type AddressUpdateFlatErrors = v.FlatErrors<
	typeof Validation.addressUpdateSchema
>;

// company types
export type Company = typeof companiesTable.$inferSelect;
export type CreateCompanyInput = typeof companiesTable.$inferInsert;
export type CreateCompanyWithAddressInput = Omit<
	CreateCompanyInput,
	"addressId"
>;
export interface UpdateCompanyWithAddressInput
	extends CreateCompanyWithAddressInput {
	companyId: string;
}

export type CompanyCreateWithAddressResult = ReturnType<
	typeof createCompanyWithAddress
>;
export type CompanyUpdateWithAddressResult = ReturnType<
	typeof updateCompanyWithAddress
>;
export type CompanyDeleteResult = ReturnType<typeof deleteCompany>;
export type CompanyGetResult = ReturnType<typeof getCompany>;
export type CompaniesGetResult = ReturnType<typeof getCompanies>;

export type CompanyCreateWithAddressFlatErrors = v.FlatErrors<
	typeof Validation.companyCreateWithAddressSchema
>;
export type CompanyUpdateWithAddressFlatErrors = v.FlatErrors<
	typeof Validation.companyUpdateWithAddressSchema
>;
export type CompanyDeleteFlatErrors = v.FlatErrors<
	typeof Validation.companyDeleteSchema
>;

// customer types
export type Customer = typeof customersTable.$inferSelect;
export type CreateCustomerInput = typeof customersTable.$inferInsert;
export type CreateCustomerWithAddressInput = Omit<
	CreateCustomerInput,
	"addressId"
>;
export interface UpdateCustomerWithAddressInput
	extends CreateCustomerWithAddressInput {
	customerId: string;
}

export type CustomerCreateWithAddressResult = ReturnType<
	typeof createCustomerWithAddress
>;
export type CustomerUpdateWithAddressResult = ReturnType<
	typeof updateCustomerWithAddress
>;
export type CustomerDeleteResult = ReturnType<typeof deleteCustomer>;
export type CustomerGetResult = ReturnType<typeof getCustomer>;
export type CustomersGetResult = ReturnType<typeof getCustomers>;

export type CustomerCreateWithAddressFlatErrors = v.FlatErrors<
	typeof Validation.customerCreateWithAddressSchema
>;
export type CustomerUpdateWithAddressFlatErrors = v.FlatErrors<
	typeof Validation.customerUpdateWithAddressSchema
>;
export type CustomerDeleteFlatErrors = v.FlatErrors<
	typeof Validation.customerDeleteSchema
>;

// service types
export type Service = typeof servicesTable.$inferSelect;
export type CreateServiceInput = typeof servicesTable.$inferInsert;
export interface UpdateServiceInput extends CreateServiceInput {
	serviceId: string;
}

export type ServiceCreateResult = ReturnType<typeof createService>;
export type ServiceUpdateResult = ReturnType<typeof updateService>;
export type ServiceDeleteResult = ReturnType<typeof deleteService>;
export type ServiceGetResult = ReturnType<typeof getService>;
export type ServicesGetResult = ReturnType<typeof getServices>;

export type ServiceCreateFlatErrors = v.FlatErrors<
	typeof Validation.serviceCreateSchema
>;
export type ServiceUpdateFlatErrors = v.FlatErrors<
	typeof Validation.serviceUpdateSchema
>;
export type ServiceDeleteFlatErrors = v.FlatErrors<
	typeof Validation.serviceDeleteSchema
>;

// tax types
export type Tax = typeof taxesTable.$inferSelect;
export type CreateTaxInput = typeof taxesTable.$inferInsert;
export interface UpdateTaxInput extends CreateTaxInput {
	taxId: string;
}

export type TaxCreateResult = ReturnType<typeof createTax>;
export type TaxUpdateResult = ReturnType<typeof updateTax>;
export type TaxDeleteResult = ReturnType<typeof deleteTax>;
export type TaxGetResult = ReturnType<typeof getTax>;
export type TaxesGetResult = ReturnType<typeof getTaxes>;

export type TaxCreateFlatErrors = v.FlatErrors<
	typeof Validation.taxCreateSchema
>;
export type TaxUpdateFlatErrors = v.FlatErrors<
	typeof Validation.taxUpdateSchema
>;
export type TaxDeleteFlatErrors = v.FlatErrors<
	typeof Validation.taxDeleteSchema
>;
