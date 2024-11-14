import type { CustomField } from '~/types/entity.types';

export function parseCustomFields<T extends string, K extends string>(
	data: object,
	customFieldIdKey: T,
	parentTableForeignKey: { key: K; id: string },
) {
	const entries = Object.entries(data);
	const customFields: Record<string, CustomField<T, K>> = {};

	entries.forEach(([key, value]) => {
		const entryValue = value.toString();

		// TODO: remove this regex and replace it with some string search method
		if (
			key.search(
				/custom-show-label-in-invoice|custom-field-index|custom-label|custom-content|custom-field-action/gi,
			) > -1
		) {
			const id = key
				.replace('custom-show-label-in-invoice-', '')
				.replace('custom-field-index-', '')
				.replace('custom-label-', '')
				.replace('custom-content-', '')
				.replace('custom-field-action-', '');

			if (!customFields[id]) {
				customFields[id] = {
					[customFieldIdKey]: id,
					[parentTableForeignKey.key]: parentTableForeignKey.id,
				} as CustomField<T, K>;
			}

			if (key === `custom-field-index-${id}`) {
				customFields[id].customFieldIndex = parseInt(entryValue, 10);
			} else if (key === `custom-label-${id}`) {
				customFields[id].label = entryValue;
			} else if (key === `custom-content-${id}`) {
				customFields[id].content = entryValue;
			} else if (key === `custom-show-label-in-invoice-${id}`) {
				customFields[id].showLabelInInvoice = entryValue === 'on';
			} else if (key === `custom-field-action-${id}`) {
				customFields[id].action = entryValue;
			}
		}
	});

	if (Object.keys(customFields).length) {
		return Object.values(customFields);
	}

	return [];
}
