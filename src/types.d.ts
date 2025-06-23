import type { companiesTable, taxesTable } from "./db/schema";
import type {
	createTax,
	deleteTax,
	getTax,
	getTaxes,
	updateTax,
} from "./main/services/taxes";
import type {
	getCompany,
	getCompanies,
	createCompany,
	updateCompany,
	deleteCompany,
} from "./main/services/companies";
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

export type Company = typeof companiesTable.$inferSelect;
export type CreateCompanyInput = typeof companiesTable.$inferInsert;
export interface UpdateCompanyInput extends CreateCompanyInput {
	companyId: string;
}

export type CompanyCreateResult = ReturnType<typeof createCompany>;
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
