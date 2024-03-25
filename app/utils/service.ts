import { ulid } from 'ulid';
import { createServiceSchema, updateServiceSchema } from '~/lib/schemas';

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
