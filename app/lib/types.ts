import * as React from 'react';
import type { IdType, Locale } from '~/lib/constants';
import type { CountryCode } from '~/lib/currencies';

export type Field = {
	id: string;
	name: string;
	label: string;
	input?: React.ComponentPropsWithoutRef<'input'>;
	error?: string;
};

export type CustomField = {
	id: string;
	label: string;
	content: string;
	showLabel?: boolean;
	labelError?: string;
	contentError?: string;
};

export type Address = {
	address1: string;
	address2?: string;
	city?: string;
	country: string;
	province?: string;
	zip?: string;
};

export type Company = {
	id: string;
	name: string;
	email: string;
	address: Address;
	custom?: Array<CustomField>;
	createdAt: string;
	updatedAt: string;
};

export type Customer = {
	id: string;
	name: string;
	email: string;
	address: Address;
	custom?: Array<CustomField>;
	createdAt: string;
	updatedAt: string;
};

export type Service = {
	id: string;
	name: string;
	description?: string;
	rate: number;
	createdAt: string;
	updatedAt: string;
};

export type Invoice = {
	id: string;
	invoiceId: string;
	invoiceIdType: IdType;
	locale: Locale;
	countryCode: CountryCode;

	invoiceDate: string;
	dueDate: string;
	dateFormat: string;

	company: Omit<Company, 'createdAt' | 'updatedAt'>;
	customer: Omit<Customer, 'createdAt' | 'updatedAt'>;
	services: Array<
		Omit<Service, 'createdAt' | 'updatedAt'> & { quantity: number }
	>;
	note?: string;

	cost: {
		subtotalAmount: number;
		shipping: number;
		tax: number;
		totalAmount: number;
	};

	createdAt: string;
	updatedAt: string;
};
