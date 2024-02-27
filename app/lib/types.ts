export type Field = {
	id: string;
	name: string;
	label: string;
	input?: React.InputHTMLAttributes<HTMLInputElement>;
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
};

export type Customer = {
	id: string;
	name: string;
	email: string;
	address: Address;
	custom?: Array<CustomField>;
};

export type Service = {
	id: string;
	name: string;
	description?: string;
	rate: number;
};

const idTypes = {
	incremental: 'incremental',
	random: 'random',
} as const;
type IdTypes = (typeof idTypes)[keyof typeof idTypes];

const locales = {
	en: 'en-US',
	fr: 'fr-FR',
} as const;
type Locales = (typeof locales)[keyof typeof locales];

export type Invoice = {
	id: string;
	invoiceId: string;
	invoiceIdType: IdTypes;
	locale: Locales;
	invoiceDate: string;
	dueDate: string;
	company: Company;
	customer: Customer;
	services: Array<Service & { quantity: number }>;
	cost: {
		currencyCode: string;
		subtotalAmount: number;
		totalAmount: number;
		tax: number;
		shipping: number;
	};
	custom?: Array<CustomField>;
	createdAt: string;
	updatedAt: string;
};
