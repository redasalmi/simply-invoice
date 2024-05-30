import { ulid } from 'ulid';
import type { CustomField } from '~/lib/types';

export function createEntity<T>(formData: FormData) {
	const entries = Array.from(formData);
	const today = new Date().toISOString();

	const entity = {
		id: ulid(),
		address: {
			id: ulid(),
		},
		createdAt: today,
		updatedAt: today,
	} as T;

	const customFields: Record<string, CustomField> = {};

	entries.forEach(([key, value]) => {
		const entryValue = value.toString();

		if (key.search(/order|label|content|show-label-in-invoice/) > -1) {
			const id = key
				.replace('order-', '')
				.replace('label-', '')
				.replace('content-', '')
				.replace('show-label-in-invoice-', '');

			if (!customFields[id]) {
				customFields[id] = { id } as CustomField;
			}

			if (key === `order-${id}`) {
				customFields[id].order = parseInt(entryValue, 10);
			} else if (key === `label-${id}`) {
				customFields[id].label = entryValue;
			} else if (key === `content-${id}`) {
				customFields[id].content = entryValue;
			} else if (key === `show-label-in-invoice-${id}`) {
				customFields[id].showLabelInInvoice = entryValue === 'on';
			}
		} else if (key.search('address-') > -1) {
			entity.address[key.replace('address-', '')] = entryValue;
		} else {
			entity[key] = entryValue;
		}
	});

	if (Object.keys(customFields).length) {
		entity.custom = Object.values(customFields);
	}

	return entity;
}

export function updateEntity<T>(formData: FormData) {
	const entries = Array.from(formData);
	const today = new Date().toISOString();

	const entity = {
		updatedAt: today,
	} as T;

	const customFields: Record<string, CustomField> = {};

	entries.forEach(([key, value]) => {
		const entryValue = value.toString();

		if (key.search(/order|label|content|show-label-in-invoice/) > -1) {
			const id = key
				.replace('order-', '')
				.replace('label-', '')
				.replace('content-', '')
				.replace('show-label-in-invoice-', '');

			if (!customFields[id]) {
				customFields[id] = { id } as CustomField;
			}

			if (key === `order-${id}`) {
				customFields[id].order = parseInt(entryValue, 10);
			} else if (key === `label-${id}`) {
				customFields[id].label = entryValue;
			} else if (key === `content-${id}`) {
				customFields[id].content = entryValue;
			} else if (key === `show-label-in-invoice-${id}`) {
				customFields[id].showLabelInInvoice = entryValue === 'on';
			}
		} else if (key.search('address-') > -1) {
			entity[key.replace('address-', 'address.')] = entryValue;
		} else {
			entity[key] = entryValue;
		}
	});

	if (Object.keys(customFields).length) {
		entity.custom = Object.values(customFields);
	}

	return entity;
}
