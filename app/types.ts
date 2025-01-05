import type { PortableTextBlock } from '@portabletext/editor';
import type { IdentifierType, Locale } from '~/lib/constants';
import type { CountryCode } from '~/lib/countries';

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

export type Invoice = {
	invoiceId: string;
	identifier: string;
	identifierType: IdentifierType;
	locale: Locale;
	currencyCountryCode: CountryCode;

	date: string;
	dueDate?: string;

	company: Company;
	customer: Customer;
	services: Array<{
		invoiceServiceId: string;
		service: Service;
		quantity: number;
		tax: Tax;
	}>;

	// this calculation could be done using an aggregation I guess
	cost: {
		subtotalAmount: number;
		totalAmount: number;
	};

	note?: Array<PortableTextBlock>;
	createdAt: string;
	updatedAt?: string;
};

export type InvoiceService = {
	invoiceServiceId: string;
	invoiceId: string;
	serviceId: string;
	quantity: number;
	taxId: string;
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
