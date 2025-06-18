import type { PaginationType } from "@types";

export function getPaginationParams(requestUrl: string) {
	const url = new URL(requestUrl);
	const cursor = url.searchParams.get("cursor");
	const paginationType = url.searchParams.get("pagination-type");

	return {
		cursor,
		paginationType: paginationType as PaginationType | null,
	};
}
