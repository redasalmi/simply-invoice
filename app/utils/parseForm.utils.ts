import { z } from 'zod';
import * as v from 'valibot';

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

export function parseFormData<T extends v.BaseSchema>(
	formData: FormData,
	schema: T,
): {
	data: v.InferOutput<typeof schema>;
	errors: Array<v.InferIssue<typeof schema>> | null;
} {
	const object = Object.fromEntries(formData);
	const data = v.safeParse(schema, object);

	if (data.issues) {
		return {
			data: null,
			errors: data.issues,
		};
	}

	return {
		data: data.output,
		errors: null,
	};
}
