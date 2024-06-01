export type Address = {
	id: string;
	address1: string;
	address2?: string;
	city?: string;
	country: string;
	province?: string;
	zip?: string;
};

export type PaginatedResult<T> = {
	items: T[];
	page: number;
	total: number;
	hasNextPage: boolean;
};
