import { ulid } from 'ulid';
import type { ZodError } from 'zod';
import {
	type CreateCompanySchemaErrors,
	type UpdateCompanySchemaErrors,
	createCompanySchema,
} from '~/lib/schemas';
import type { Company, CustomField } from '~/lib/types';

type ZodErrors<T extends 'create' | 'update'> = T extends 'create'
	? CreateCompanySchemaErrors
	: UpdateCompanySchemaErrors;

type CustomErrors = Record<string, { label?: string; content?: string }>;

type ActionErrors = {
	name?: string;
	email?: string;
	address1?: string;
	country?: string;
	custom?: Record<string, { label?: string; content?: string }>;
};

export function createCompany(formData: FormData) {
	const entries = Array.from(formData.entries());
	const today = new Date().toISOString();

	const entity = {
		id: ulid(),
		address: {
			id: ulid(),
		},
		createdAt: today,
		updatedAt: today,
	} as Company;

	const customFields: Record<string, CustomField> = {};
	entries.forEach(([key, value]) => {
		const entityValue = value.toString();

		if (key.search(/label|content|order|show-label-in-invoice/) > -1) {
			const id = key
				.replace('order-', '')
				.replace('label-', '')
				.replace('content-', '')
				.replace('show-label-in-invoice', '');

			if (!customFields[id]) {
				customFields[id] = { id } as CustomField;
			}

			if (key === `label-${id}`) {
				customFields[id].label = entityValue;
			} else if (key === `content-${id}`) {
				customFields[id].content = entityValue;
			} else if (key === `show-label-in-invoice-${id}`) {
				customFields[id].showLabelInInvoice = entityValue === 'on';
			} else if (key === `order-${id}`) {
				customFields[id].order = parseInt(entityValue, 10);
			}
		} else if (key.search('address-') > -1) {
			entity.address[key.replace('address-', '')] = entityValue;
		} else {
			entity[key] = entityValue;
		}
	});

	if (Object.keys(customFields).length) {
		entity.custom = Object.values(customFields);
	}

	createCompanySchema.parse(entity);

	return entity;
}

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
		errors.address1 = zodErrors.address.address1._errors[0];
	}
	if (zodErrors.address?.country?._errors?.[0]) {
		errors.country = zodErrors.address.country._errors[0];
	}
	if (Object.keys(customErrors).length) {
		errors.custom = customErrors;
	}

	return errors;
};
