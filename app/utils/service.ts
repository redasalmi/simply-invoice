import { ulid } from 'ulid';
import { type ZodError } from 'zod';
import {
	createServiceSchema,
	type CreateServiceSchemaErrors,
	updateServiceSchema,
	type UpdateServiceSchemaErrors,
} from '~/lib/schemas';

type ZodErrors<T extends 'create' | 'update'> = T extends 'create'
	? CreateServiceSchemaErrors
	: UpdateServiceSchemaErrors;

type ActionErrors = {
	name?: string;
	rate?: string;
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

export const getServiceActionErrors = <T extends 'create' | 'update'>(
	err: ZodError,
) => {
	const zodErrors: ZodErrors<T> = err.format();
	const errors: ActionErrors = {};

	if (zodErrors.name?._errors?.[0]) {
		errors.name = zodErrors.name._errors[0];
	}
	if (zodErrors.rate?._errors?.[0]) {
		errors.rate = zodErrors.rate._errors[0];
	}

	return errors;
};
