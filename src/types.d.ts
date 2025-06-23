import type { taxesTable } from "./db/schema";
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
