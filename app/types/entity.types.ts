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
