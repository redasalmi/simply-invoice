import type { PortableTextBlock } from '@portabletext/editor';

export type Address = {
	addressId: string;
	address1: string;
	address2?: string;
	city?: string;
	country: string;
	province?: string;
	zip?: string;
};

export type Company = {
	companyId: string;
	name: string;
	email: string;
	address: Address;
	additionalInformation?: Array<PortableTextBlock>;
	createdAt: string;
	updatedAt?: string;
};

export type Customer = {
	customerId: string;
	name: string;
	email: string;
	address: Address;
	additionalInformation?: Array<PortableTextBlock>;
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

export type Tax = {
	taxId: string;
	name: string;
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

export type StringReplace<
	TString extends string,
	TToReplace extends string,
	TReplacement extends string,
> = TString extends `${infer TPrefix}${TToReplace}${infer TSuffix}`
	? `${TPrefix}${TReplacement}${StringReplace<
			TSuffix,
			TToReplace,
			TReplacement
		>}`
	: TString;
