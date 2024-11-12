import type { CustomField } from '~/types/entity.types';

export function parseCustomFields(
	data: object,
	customFieldIdKey: string,
	parentTableForeignKey: { key: string; id: string },
) {
	const entries = Object.entries(data);
	const customFields: Record<string, CustomField> = {};

	entries.forEach(([key, value]) => {
		const entryValue = value.toString();

		if (
			key.search(
				/custom-show-label-in-invoice|custom-field-index|custom-label|custom-content/gi,
			) > -1
		) {
			const id = key
				.replace('custom-show-label-in-invoice-', '')
				.replace('custom-field-index-', '')
				.replace('custom-label-', '')
				.replace('custom-content-', '');

			if (!customFields[id]) {
				customFields[id] = {
					[customFieldIdKey]: id,
					[parentTableForeignKey.key]: parentTableForeignKey.id,
				} as CustomField;
			}

			if (key === `custom-field-index-${id}`) {
				customFields[id].customFieldIndex = parseInt(entryValue, 10);
			} else if (key === `custom-label-${id}`) {
				customFields[id].label = entryValue;
			} else if (key === `custom-content-${id}`) {
				customFields[id].content = entryValue;
			} else if (key === `custom-show-label-in-invoice-${id}`) {
				customFields[id].showLabelInInvoice = entryValue === 'on';
			}
		}
	});

	if (Object.keys(customFields).length) {
		return Object.values(customFields);
	}

	return [];
}
