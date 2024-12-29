import * as v from 'valibot';

export function parseFormData<
	T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(formData: FormData, schema: T) {
	const object = Object.fromEntries(formData);
	const data = v.safeParse(schema, object, { abortPipeEarly: true });

	if (data.issues) {
		return {
			data: null,
			errors: v.flatten<typeof schema>(data.issues),
		};
	}

	return {
		data: data.output,
		errors: null,
	};
}
