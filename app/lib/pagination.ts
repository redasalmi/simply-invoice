export type PageInfo = {
	endCursor?: string;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startCursor?: string;
};

export type PaginatedResult<T> = {
	items: T[];
	total: number;
	pageInfo: PageInfo;
};

// temp limit until this is stored as a part of the app settings in the store
export const itemsPerPage = 10;
