import type { Customer } from './customer.types';
import type { Company } from './company.types';

export type Entity = Company | Customer;

export type EntityType = 'company' | 'customer';

export type EntityActionErrors = {
	name?: string;
	email?: string;
	'address-address1'?: string;
	'address-country'?: string;
	custom?: Record<string, { label?: string; content?: string }>;
};

export type CustomField<T extends string, K extends string> = {
	[key in T]: string;
} & {
	[key in K]: string;
} & {
	customFieldIndex: number;
	label: string;
	content: string;
	showLabelInInvoice?: boolean;
	action?: 'create' | 'update' | 'delete';
};
