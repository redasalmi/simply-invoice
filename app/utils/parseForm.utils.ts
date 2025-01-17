import * as v from 'valibot';

type FormDataEntriesObject = Record<string, FormDataEntryValue>;

function removeEmptyProperties(obj: FormDataEntriesObject) {
	for (const key in obj) {
		if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
			delete obj[key];
		} else if (typeof obj[key] === 'object') {
			removeEmptyProperties(obj[key] as unknown as FormDataEntriesObject);
		}
	}

	return obj;
}

export function parseFormData<
	T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(formData: FormData, schema: T) {
	const object = removeEmptyProperties(Object.fromEntries(formData));
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
