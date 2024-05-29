import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ulid } from 'ulid';
import type { CustomField } from '~/lib/types';

export function cn(...inputs: Array<ClassValue>) {
	return twMerge(clsx(inputs));
}

export function createEntity<T>(formData: FormData) {
	const entries = Array.from(formData.entries());

	const entity = {
		id: ulid(),
		address: {
			id: ulid(),
		},
	} as T;

	const customFields: Record<string, CustomField> = {};
	entries.forEach(([key, value]) => {
		const entityValue = value.toString();

		if (key.search(/label|content|order|show-label-in-invoice/) > -1) {
			const id = key
				.replace('order-', '')
				.replace('label-', '')
				.replace('content-', '')
				.replace('show-label-in-invoice', '');

			if (!customFields[id]) {
				customFields[id] = { id } as CustomField;
			}

			if (key === `label-${id}`) {
				customFields[id].label = entityValue;
			} else if (key === `content-${id}`) {
				customFields[id].content = entityValue;
			} else if (key === `show-label-in-invoice-${id}`) {
				customFields[id].showLabelInInvoice = entityValue === 'on';
			} else if (key === `order-${id}`) {
				customFields[id].order = parseInt(entityValue, 10);
			}
		} else if (key.search('address-') > -1) {
			entity.address[key.replace('address-', '')] = entityValue;
		} else {
			entity[key] = entityValue;
		}
	});

	if (Object.keys(customFields).length) {
		entity.custom = Object.values(customFields);
	}

	return entity;
}
