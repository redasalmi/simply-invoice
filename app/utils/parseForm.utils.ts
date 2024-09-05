import type { z } from 'zod';

export type FormSchema<T extends z.ZodRawShape> =
	| z.ZodObject<T>
	| z.ZodEffects<z.ZodObject<T>>;

export type FormErrors<T> = Record<keyof T, string>;

export function parseFormDataErrors<T>(err: z.ZodError<T>) {
	const zodErrors = err.format();
	const errors = {} as FormErrors<T>;

	for (const [key, value] of Object.entries(zodErrors)) {
		if (key === '_errors' || !(value && '_errors' in value)) {
			continue;
		}

		errors[key as keyof T] = value._errors[0];
	}

	return errors;
}

export function parseFormData<T extends z.ZodRawShape>(
	formData: FormData,
	schema: FormSchema<T>,
) {
	const object = Object.fromEntries(formData);
	const parsedObject = schema.safeParse(object);

	if (parsedObject.error) {
		return {
			errors: parseFormDataErrors(parsedObject.error),
		};
	}

	return {
		data: parsedObject.data,
	};
}
