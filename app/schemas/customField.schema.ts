import * as v from 'valibot';

export const customLabelKey = 'custom-label' as const;
export const customContentKey = 'custom-content' as const;

type CustomFieldKeyType = typeof customLabelKey | typeof customContentKey;

const customFieldErrors = {
	[customLabelKey]: 'Label is required',
	[customContentKey]: 'Content is required',
};

export function safeParseCustomField(key: string, value: unknown) {
	let keyType: CustomFieldKeyType | null = null;
	if (key.includes(customLabelKey)) {
		keyType = customLabelKey;
	} else if (key.includes(customContentKey)) {
		keyType = customContentKey;
	}

	if (!keyType) {
		return null;
	}

	const keySchema = v.custom<`${CustomFieldKeyType}-${string}`>((value) => {
		if (typeof value !== 'string' || !value.includes(keyType)) {
			return false;
		}

		return v.safeParse(
			v.pipe(v.string(), v.ulid()),
			value.replace(`${keyType}-`, ''),
		).success;
	});

	const valueSchema = v.pipe(
		v.string(),
		v.nonEmpty(customFieldErrors[keyType]),
	);
	const recordSchema = v.record(keySchema, valueSchema);

	return v.safeParse(recordSchema, {
		[key]: value,
	});
}
