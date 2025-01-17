import type { CountryCode } from '~/lib/countries';
import type { IdentifierType, Locale } from '~/lib/constants';

export type DBAddress = {
	address_id: string;
	address1: string;
	address2?: string;
	city?: string;
	country: string;
	province?: string;
	zip?: string;
	created_at: string;
	updated_at?: string;
};

export type DBCompany = {
	company_id: string;
	name: string;
	email: string;
	additional_information?: string;
	address_id: string;
	created_at: string;
	updated_at?: string;
};

export type DBCustomer = {
	customer_id: string;
	name: string;
	email: string;
	additional_information?: string;
	address_id: string;
	created_at: string;
	updated_at?: string;
};

export type DBService = {
	service_id: string;
	name: string;
	description?: string;
	rate: number;
	created_at: string;
	updated_at?: string;
};

export type DBTax = {
	tax_id: string;
	name: string;
	rate: number;
	created_at: string;
	updated_at?: string;
};

export type DBInvoice = {
	invoice_id: string;
	identifier: string;
	identifier_type: IdentifierType;
	locale: Locale;
	currency_country_code: CountryCode;
	date: string;
	due_date?: string;
	company_id: string;
	customer_id: string;
	subtotal_amount: number;
	total_amount: number;
	note?: string;
	created_at: string;
	updated_at?: string;
};

export type DBInvoiceService = {
	invoice_service_id: string;
	service_id: string;
	invoice_id: string;
	quantity: number;
	tax_id: string;
	created_at: string;
	updated_at?: string;
};
