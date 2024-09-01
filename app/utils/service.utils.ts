import type { z } from 'zod';
import {
	serviceFormSchema,
	type ServiceFormSchemaErrors,
} from '~/schemas/service.schemas';

export function parseServiceForm(formData: FormData) {
	const serviceFormData = {
		name: formData.get('name'),
		description: formData.get('description'),
		rate: formData.get('rate'),
	};
	const service = serviceFormSchema.safeParse(serviceFormData);

	return service;
}

type ActionErrors = {
	name?: string;
	rate?: string;
};

export function parseServiceFormErrors(err: z.ZodError) {
	const zodErrors: ServiceFormSchemaErrors = err.format();
	const errors: ActionErrors = {};

	if (zodErrors.name?._errors?.[0]) {
		errors.name = zodErrors.name._errors[0];
	}
	if (zodErrors.rate?._errors?.[0]) {
		errors.rate = zodErrors.rate._errors[0];
	}

	return errors;
}
