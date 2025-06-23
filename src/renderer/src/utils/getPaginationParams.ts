import type { PaginationType } from "~/types";

export const paginationTypes = {
	previous: "previous",
	next: "next",
};

export const cursorParam = "cursor";
export const paginationTypeParam = "pagination-type";

export function getPaginationParams(requestUrl: string) {
	const url = new URL(requestUrl);
	const cursor = url.searchParams.get(cursorParam);
	const paginationType = url.searchParams.get(paginationTypeParam);

	return {
		cursor,
		paginationType: paginationType as PaginationType | null,
	};
}
