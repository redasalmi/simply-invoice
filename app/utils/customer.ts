import { ParsedQuery } from 'query-string';
import { ulid } from 'ulid';

import { createCustomerSchema, updateCustomerSchema } from '~/lib/schemas';

import { extractCustomFields } from '~/utils/shared';

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
