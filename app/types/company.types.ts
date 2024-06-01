import type { Address } from './common.types';
import type { CustomField } from './formField.types';

export type Company = {
	id: string;
	name: string;
	email: string;
	address: Address;
	custom?: Array<CustomField>;
	createdAt: string;
	updatedAt: string;
};

export type UpdateCompany = {
	id: string;
	name: string;
	email: string;
	'address.address1': string;
	'address.address2'?: string;
	'address.city'?: string;
	'address.country': string;
	'address.province'?: string;
	'address.zip'?: string;
	custom?: Array<CustomField>;
	updatedAt: string;
};
