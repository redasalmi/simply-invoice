import { type ParsedQuery } from 'query-string';
import { ulid } from 'ulid';
import { type ZodError } from 'zod';
import {
	createCustomerSchema,
	type CreateCustomerSchemaErrors,
	updateCustomerSchema,
	type UpdateCustomerSchemaErrors,
} from '~/lib/schemas';
import { extractCustomFields } from '~/utils/shared';

type ZodErrors<T extends 'create' | 'update'> = T extends 'create'
	? CreateCustomerSchemaErrors
	: UpdateCustomerSchemaErrors;

type CustomErrors = Record<string, { label?: string; content?: string }>;

type ActionErrors = {
	name?: string;
	email?: string;
	address1?: string;
	country?: string;
	custom?: Record<string, { label?: string; content?: string }>;
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

export const getCustomerActionErrors = <T extends 'create' | 'update'>(
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
