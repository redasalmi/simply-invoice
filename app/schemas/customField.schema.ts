import * as v from 'valibot';
import type { CustomField, CustomFieldAction } from '~/types';

export const customFieldIndexKey = 'custom-field-index';
export const customFieldLabelKey = 'custom-field-label';
export const customFieldContentKey = 'custom-field-content';
export const customFieldActionKey = 'custom-field-action';

type CustomFieldKeyType =
	| typeof customFieldLabelKey
	| typeof customFieldContentKey;

const customFieldErrors = {
	[customFieldLabelKey]: 'Label is required',
	[customFieldContentKey]: 'Content is required',
};

export function safeParseCustomField(key: string, value: unknown) {
	let keyType: CustomFieldKeyType | null = null;
	if (key.includes(customFieldLabelKey)) {
		keyType = customFieldLabelKey;
	} else if (key.includes(customFieldContentKey)) {
		keyType = customFieldContentKey;
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

export function parseCustomFields<T extends string, K extends string>(
	data: object,
	customFieldIdKey: T,
	customFieldForeignKey: { key: K; id: string },
) {
	const entries = Object.entries(data) as Array<[string, string | undefined]>;
	const customFields: Record<string, CustomField<T, K>> = {};

	for (let index = 0; index < entries.length; index++) {
		const [key, value] = entries[index];
		if (!value) {
			continue;
		}

		const entryValue = value.toString();
		const entryKeys = key.split('-');
		const entryId = entryKeys[entryKeys.length - 1];

		const isValidUlidId = v.safeParse(v.pipe(v.string(), v.ulid()), entryId);
		if (!isValidUlidId.success) {
			continue;
		}

		const fieldIndexKey = `${customFieldIndexKey}-${entryId}`;
		const fieldLabelKey = `${customFieldLabelKey}-${entryId}`;
		const fieldContentKey = `${customFieldContentKey}-${entryId}`;
		const fieldActionKey = `${customFieldActionKey}-${entryId}`;

		const isCustomFieldEntry = [
			fieldIndexKey,
			fieldLabelKey,
			fieldContentKey,
			fieldActionKey,
		].includes(key);
		if (!isCustomFieldEntry) {
			continue;
		}

		if (!customFields[entryId]) {
			customFields[entryId] = {
				[customFieldIdKey]: entryId,
				[customFieldForeignKey.key]: customFieldForeignKey.id,
			} as CustomField<T, K>;
		}

		if (key === fieldIndexKey) {
			customFields[entryId].customFieldIndex = parseInt(entryValue, 10);
		} else if (key === fieldLabelKey) {
			customFields[entryId].label = entryValue;
		} else if (key === fieldContentKey) {
			customFields[entryId].content = entryValue;
		} else if (key === fieldActionKey) {
			customFields[entryId].action = entryValue as CustomFieldAction;
		}
	}

	if (!Object.keys(customFields).length) {
		return [];
	}

	return Object.values(customFields);
}
