export type Address = {
	addressId: string;
	address1: string;
	address2?: string;
	city?: string;
	country: string;
	province?: string;
	zip?: string;
};

export type CompanyCustomField = {
	companyCustomFieldId: string;
	customFieldIndex: number;
	label: string;
	content: string;
	companyId: string;
	createdAt: string;
	updatedAt?: string;
};

export type Company = {
	companyId: string;
	name: string;
	email: string;
	address: Address;
	customFields: Array<CompanyCustomField>;
	createdAt: string;
	updatedAt?: string;
};

export type CustomerCustomField = {
	customerCustomFieldId: string;
	customFieldIndex: number;
	label: string;
	content: string;
	customerId: string;
	createdAt: string;
	updatedAt?: string;
};

export type Customer = {
	customerId: string;
	name: string;
	email: string;
	address: Address;
	customFields: Array<CustomerCustomField>;
	createdAt: string;
	updatedAt?: string;
};

export type Service = {
	serviceId: string;
	name: string;
	description?: string;
	rate: number;
	createdAt: string;
	updatedAt?: string;
};

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
