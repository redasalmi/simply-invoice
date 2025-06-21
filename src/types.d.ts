import type { taxesTable } from "./db/schema";
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

export type SelectTax = typeof taxesTable.$inferSelect;
export type InsertTax = typeof taxesTable.$inferInsert;
