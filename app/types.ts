import type { PortableTextBlock } from '@portabletext/editor';
import type { IdentifierType, Locale } from '~/lib/constants';
import type { CountryCode } from '~/lib/countries';

export interface Address {
	addressId: string;
	address1: string;
	address2?: string;
	city?: string;
	country: string;
	province?: string;
	zip?: string;
	createdAt: string;
	updatedAt?: string;
}

export interface DBCompany {
	companyId: string;
	name: string;
	email: string;
	additionalInformation?: string;
	addressId: string;
	createdAt: string;
	updatedAt?: string;
}

export interface Company
	extends Omit<DBCompany, 'additionalInformation' | 'addressId'> {
	additionalInformation?: Array<PortableTextBlock>;
	address: Address;
}

export interface DBCustomer {
	customerId: string;
	name: string;
	email: string;
	additionalInformation?: string;
	addressId: string;
	createdAt: string;
	updatedAt?: string;
}

export interface Customer
	extends Omit<DBCustomer, 'additionalInformation' | 'addressId'> {
	additionalInformation?: Array<PortableTextBlock>;
	address: Address;
}

export interface Service {
	serviceId: string;
	name: string;
	description?: string;
	rate: number;
	createdAt: string;
	updatedAt?: string;
}

export interface Tax {
	taxId: string;
	name: string;
	rate: number;
	createdAt: string;
	updatedAt?: string;
}

export interface DBInvoice {
	invoiceId: string;
	identifier: string;
	identifierType: IdentifierType;
	locale: Locale;
	currencyCountryCode: CountryCode;
	date: string;
	dueDate?: string;
	companyId: string;
	customerId: string;
	subtotalAmount: number;
	totalAmount: number;
	note?: string;
	createdAt: string;
	updatedAt?: string;
}

export interface Invoice {
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
	cost: {
		subtotalAmount: number;
		totalAmount: number;
	};
	note?: Array<PortableTextBlock>;
	createdAt: string;
	updatedAt?: string;
}

export interface DBInvoiceService {
	invoiceServiceId: string;
	invoiceId: string;
	serviceId: string;
	quantity: number;
	taxId: string;
	createdAt: string;
	updatedAt?: string;
}

export interface InvoiceService {
	invoiceServiceId: string;
	service: Service;
	invoiceId: string;
	quantity: number;
	tax: Tax;
	createdAt: string;
	updatedAt?: string;
}

export interface PageInfo {
	endCursor?: string;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startCursor?: string;
}

export interface PaginatedResult<T> {
	items: T[];
	total: number;
	pageInfo: PageInfo;
}

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
