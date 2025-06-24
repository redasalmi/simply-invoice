import type { addressesTable, companiesTable, taxesTable } from "./db/schema";
import type {
	createCompany,
	createCompanyWithAddress,
	deleteCompany,
	getCompanies,
	getCompany,
	updateCompany,
} from "./main/services/companies";
import type {
	createTax,
	deleteTax,
	getTax,
	getTaxes,
	updateTax,
} from "./main/services/taxes";
import type { paginationTypes } from "./renderer/src/utils/getPaginationParams";

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

export type Address = typeof addressesTable.$inferSelect;
export type CreateAddressInput = typeof addressesTable.$inferInsert;
export interface UpdateAddressInput extends CreateAddressInput {
	addressId: string;
}

export type Company = typeof companiesTable.$inferSelect;
export type CreateCompanyInput = typeof companiesTable.$inferInsert;
export type CreateCompanyWithAddressInput = Omit<
	CreateCompanyInput,
	"addressId"
>;
export interface UpdateCompanyInput extends CreateCompanyInput {
	companyId: string;
}

export type CompanyCreateWithAddressResult = ReturnType<
	typeof createCompanyWithAddress
>;
export type CompanyUpdateResult = ReturnType<typeof updateCompany>;
export type CompanyDeleteResult = ReturnType<typeof deleteCompany>;
export type CompanyGetResult = ReturnType<typeof getCompany>;
export type CompaniesGetResult = ReturnType<typeof getCompanies>;

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
