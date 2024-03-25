import { ParsedQuery } from 'query-string';
import { ulid } from 'ulid';
import { createCompamySchema, updateCompanySchema } from '~/lib/schemas';
import { extractCustomFields } from '~/utils/shared';

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
