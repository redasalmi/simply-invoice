import { z } from 'zod';

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

	const keySchema = z.custom<`${CustomFieldKeyType}-${string}`>((value) => {
		if (typeof value !== 'string' || !value.includes(keyType)) {
			return false;
		}

		return z
			.string()
			.ulid()
			.safeParse(value.replace(`${keyType}-`, '')).success;
	});

	const valueSchema = z
		.string()
		.min(1, { message: customFieldErrors[keyType] });
	const recordSchema = z.record(keySchema, valueSchema);

	return recordSchema.safeParse({
		[key]: value,
	});
}
