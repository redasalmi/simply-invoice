import { ulid } from 'ulid';
import type { z } from 'zod';
import {
	type CreateServiceSchemaErrors,
	type UpdateServiceSchemaErrors,
} from '~/schemas/service.schemas';
import type { Service, UpdateService } from '~/types/service.types';

export function parseCreateServiceForm(formData: FormData) {
	const today = new Date().toISOString();
	const service = {
		id: ulid(),
		name: formData.get('name')?.toString(),
		description: formData.get('description')?.toString(),
		rate: Number(formData.get('rate')),
		createdAt: today,
		updatedAt: today,
	} as Service;

	return service;
}

export function parseUpdateServiceForm(serviceId: string, formData: FormData) {
	const today = new Date().toISOString();
	const service = {
		id: serviceId,
		name: formData.get('name')?.toString(),
		description: formData.get('description')?.toString(),
		rate: Number(formData.get('rate')),
		updatedAt: today,
	} as UpdateService;

	return service;
}

type ZodErrors<T extends 'create' | 'update'> = T extends 'create'
	? CreateServiceSchemaErrors
	: UpdateServiceSchemaErrors;

type ActionErrors = {
	name?: string;
	rate?: string;
};

export function parseServiceActionErrors<T extends 'create' | 'update'>(
	err: z.ZodError,
) {
	const zodErrors: ZodErrors<T> = err.format();
	const errors: ActionErrors = {};

	if (zodErrors.name?._errors?.[0]) {
		errors.name = zodErrors.name._errors[0];
	}
	if (zodErrors.rate?._errors?.[0]) {
		errors.rate = zodErrors.rate._errors[0];
	}

	return errors;
}
