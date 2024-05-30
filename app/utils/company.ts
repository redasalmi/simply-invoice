import { type ParsedQuery } from 'query-string';
import { ulid } from 'ulid';
import type { ZodError } from 'zod';
import {
	createCompanySchema,
	type CreateCompanySchemaErrors,
	updateCompanySchema,
	type UpdateCompanySchemaErrors,
} from '~/lib/schemas';
import type { Company, CustomField } from '~/lib/types';
import { extractCustomFields } from '~/utils/shared';

type ZodErrors<T extends 'create' | 'update'> = T extends 'create'
	? CreateCompanySchemaErrors
	: UpdateCompanySchemaErrors;

type CustomErrors = Record<string, { label?: string; content?: string }>;

type ActionErrors = {
	name?: string;
	email?: string;
	'address-address1'?: string;
	'address-country'?: string;
	custom?: Record<string, { label?: string; content?: string }>;
};

export const createCompany = (formData: FormData) => {
	const entries = Array.from(formData);
	const today = new Date().toISOString();

	const newCompany = {
		id: ulid(),
		address: {
			id: ulid(),
		},
		createdAt: today,
		updatedAt: today,
	} as Company;

	const customFields: Record<string, CustomField> = {};

	entries.forEach(([key, value]) => {
		const entryValue = value.toString();

		if (key.search(/order|label|content|show-label-in-invoice/) > -1) {
			const id = key
				.replace('order-', '')
				.replace('label-', '')
				.replace('content-', '')
				.replace('show-label-in-invoice-', '');

			if (!customFields[id]) {
				customFields[id] = { id } as CustomField;
			}

			if (key === `order-${id}`) {
				customFields[id].order = parseInt(entryValue, 10);
			} else if (key === `label-${id}`) {
				customFields[id].label = entryValue;
			} else if (key === `content-${id}`) {
				customFields[id].content = entryValue;
			} else if (key === `show-label-in-invoice-${id}`) {
				customFields[id].showLabelInInvoice = entryValue === 'on';
			}
		} else if (key.search('address-') > -1) {
			newCompany.address[key.replace('address-', '')] = entryValue;
		} else {
			newCompany[key] = entryValue;
		}
	});

	if (Object.keys(customFields).length) {
		newCompany.custom = Object.values(customFields);
	}

	return createCompanySchema.parse(newCompany);
};

export const updateCompany = (
	companyId: string,
	formData: ParsedQuery<string>,
) => {
	const today = new Date().toISOString();
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

export const getCompanyActionErrors = <T extends 'create' | 'update'>(
	err: ZodError,
) => {
	const zodErrors: ZodErrors<T> = err.format();
	const customErrors: CustomErrors = {};

	if (zodErrors.custom) {
		for (const [key, value] of Object.entries(zodErrors.custom)) {
			if (key === '_errors') {
				continue;
			}

			if (!Array.isArray(value)) {
				customErrors[key] = {};
				if (value?.label?._errors?.[0]) {
					customErrors[key].label = value?.label?._errors?.[0];
				}

				if (value?.content?._errors?.[0]) {
					customErrors[key].content = value?.content?._errors?.[0];
				}
			}
		}
	}

	const errors: ActionErrors = {};
	if (zodErrors.name?._errors?.[0]) {
		errors.name = zodErrors.name._errors[0];
	}
	if (zodErrors.email?._errors?.[0]) {
		errors.email = zodErrors.email._errors[0];
	}
	if (zodErrors.address?.address1?._errors?.[0]) {
		errors['address-address1'] = zodErrors.address.address1._errors[0];
	}
	if (zodErrors.address?.country?._errors?.[0]) {
		errors['address-country'] = zodErrors.address.country._errors[0];
	}
	if (Object.keys(customErrors).length) {
		errors.custom = customErrors;
	}

	return errors;
};
