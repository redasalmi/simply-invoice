import type { PaginatedResult } from "~/types";

export function emptyResult<T>(itemsPerPage: number): PaginatedResult<T> {
	return {
		items: [],
		itemsPerPage,
		total: 0,
		pageInfo: {
			endCursor: "",
			hasNextPage: false,
			hasPreviousPage: false,
			startCursor: "",
		},
	};
}
