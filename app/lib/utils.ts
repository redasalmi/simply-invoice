import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import type { ParsedQuery } from 'query-string';
import { twMerge } from 'tailwind-merge';
import { ulid } from 'ulid';

import {
	createCompamySchema,
	createCustomerSchema,
	createServiceSchema,
	updateCompanySchema,
	updateCustomerSchema,
	updateServiceSchema,
} from '~/lib/schemas';
import { CustomField } from '~/lib/types';

export function cn(...inputs: Array<ClassValue>) {
	return twMerge(clsx(inputs));
}

export function capitalize(text: string) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

export function dateFormatter(
	locale: string,
	options?: Intl.DateTimeFormatOptions,
) {
	const opt = Object.assign(
		{},
		{ month: 'long', day: '2-digit', year: 'numeric' },
		options,
	);
	const formatter = new Intl.DateTimeFormat(locale, opt);

	return formatter;
}

export function extractCustomFields(formData: ParsedQuery<string>) {
	const customFields: Record<
		string,
		Omit<CustomField, 'label' | 'content'> & {
			label?: string;
			content?: string;
		}
	> = {};

	for (const [key, value] of Object.entries(formData)) {
		if (key.search('custom-') !== -1) {
			const id = key
				.replace('custom-', '')
				.replace('show-label-', '')
				.replace('label-', '')
				.replace('content-', '');

			if (!customFields[id]) {
				customFields[id] = {
					id,
				} as CustomField;
			}

			if (key === `custom-label-${id}`) {
				customFields[id].label = value?.toString();
			} else if (key === `custom-content-${id}`) {
				customFields[id].content = value?.toString();
			} else if (key === `custom-show-label-${id}`) {
				customFields[id].showLabel = value === 'on';
			}
		}
	}

	return customFields;
}

export const createCompany = (formData: ParsedQuery<string>) => {
	const today = new Date().toLocaleDateString();
	const customFields = extractCustomFields(formData);
	const newCompany = createCompamySchema.parse({
		id: ulid(),
		name: formData['name']?.toString(),
		email: formData['email']?.toString(),
		address: {
			address1: formData['address1']?.toString(),
			address2: formData['address2']?.toString(),
			city: formData['city']?.toString(),
			country: formData['country']?.toString(),
			province: formData['province']?.toString(),
			zip: formData['zip']?.toString(),
		},
		...(Object.keys(customFields).length
			? { custom: Object.values(customFields) }
			: undefined),
		createdAt: today,
		updatedAt: today,
	});

	return newCompany;
};

export const createCustomer = (formData: ParsedQuery<string>) => {
	const today = new Date().toLocaleDateString();
	const customFields = extractCustomFields(formData);
	const newCustomer = createCustomerSchema.parse({
		id: ulid(),
		name: formData['name']?.toString(),
		email: formData['email']?.toString(),
		address: {
			address1: formData['address1']?.toString(),
			address2: formData['address2']?.toString(),
			city: formData['city']?.toString(),
			country: formData['country']?.toString(),
			province: formData['province']?.toString(),
			zip: formData['zip']?.toString(),
		},
		...(Object.keys(customFields).length
			? { custom: Object.values(customFields) }
			: undefined),
		createdAt: today,
		updatedAt: today,
	});

	return newCustomer;
};

export const createService = (formData: FormData) => {
	const today = new Date().toLocaleDateString();
	const newService = createServiceSchema.parse({
		id: ulid(),
		name: formData.get('name')?.toString(),
		description: formData.get('description')?.toString(),
		rate: Number(formData.get('rate')),
		createdAt: today,
		updatedAt: today,
	});

	return newService;
};

export const updateCompany = (
	companyId: string,
	formData: ParsedQuery<string>,
) => {
	const today = new Date().toLocaleDateString();
	const customFields = extractCustomFields(formData);
	const updatedCompany = updateCompanySchema.parse({
		id: companyId,
		name: formData['name']?.toString(),
		email: formData['email']?.toString(),
		address: {
			address1: formData['address1']?.toString(),
			address2: formData['address2']?.toString(),
			city: formData['city']?.toString(),
			country: formData['country']?.toString(),
			province: formData['province']?.toString(),
			zip: formData['zip']?.toString(),
		},
		...(Object.keys(customFields).length
			? { custom: Object.values(customFields) }
			: undefined),
		updatedAt: today,
	});

	return updatedCompany;
};

export const updateCustomer = (
	customerId: string,
	formData: ParsedQuery<string>,
) => {
	const today = new Date().toLocaleDateString();
	const customFields = extractCustomFields(formData);
	const updatedCustomer = updateCustomerSchema.parse({
		id: customerId,
		name: formData['name']?.toString(),
		email: formData['email']?.toString(),
		address: {
			address1: formData['address1']?.toString(),
			address2: formData['address2']?.toString(),
			city: formData['city']?.toString(),
			country: formData['country']?.toString(),
			province: formData['province']?.toString(),
			zip: formData['zip']?.toString(),
		},
		...(Object.keys(customFields).length
			? { custom: Object.values(customFields) }
			: undefined),
		updatedAt: today,
	});

	return updatedCustomer;
};

export const updateService = (serviceId: string, formData: FormData) => {
	const today = new Date().toLocaleDateString();
	const updatedService = updateServiceSchema.parse({
		id: serviceId,
		name: formData.get('name')?.toString(),
		description: formData.get('description')?.toString(),
		rate: Number(formData.get('rate')),
		updatedAt: today,
	});

	return updatedService;
};
