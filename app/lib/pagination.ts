import type { PaginatedResult } from '~/types';

// temp limit until this is stored as a part of the app settings in the store
export const itemsPerPage = 10;

export const emptyResult: PaginatedResult<unknown> = {
	items: [],
	total: 0,
	pageInfo: {
		endCursor: '',
		hasNextPage: false,
		hasPreviousPage: false,
		startCursor: '',
	},
};

export const paginationTypes = {
	previous: 'previous',
	next: 'next',
};
export type PaginationType = keyof typeof paginationTypes;

export const cursorParam = 'cursor';
export const paginationTypeParam = 'pagination-type';

export function getPaginationParams(requestUrl: string) {
	const url = new URL(requestUrl);
	const cursor = url.searchParams.get(cursorParam);
	const paginationType = url.searchParams.get(
		paginationTypeParam,
	) as PaginationType | null;

	return {
		cursor,
		paginationType,
	};
}
