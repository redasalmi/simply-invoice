import { type ClassValue, clsx } from 'clsx';
import type { ParsedQuery } from 'query-string';
import { twMerge } from 'tailwind-merge';
import { ulid } from 'ulid';
import type { CustomField } from '~/lib/types';

export function cn(...inputs: Array<ClassValue>) {
	return twMerge(clsx(inputs));
}

export function capitalize(text: string) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

export function dateFormatter(
	locale: string,
	options?: Intl.DateTimeFormatOptions,
) {
	const opt = Object.assign(
		{},
		{ month: 'long', day: '2-digit', year: 'numeric' },
		options,
	);
	const formatter = new Intl.DateTimeFormat(locale, opt);

	return formatter;
}

export function extractCustomFields(formData: ParsedQuery<string>) {
	const customFields: Record<
		string,
		Omit<CustomField, 'label' | 'content'> & {
			label?: string;
			content?: string;
		}
	> = {};

	for (const [key, value] of Object.entries(formData)) {
		if (key.search('custom-') !== -1) {
			const id = key
				.replace('custom-', '')
				.replace('show-label-', '')
				.replace('label-', '')
				.replace('content-', '');

			if (!customFields[id]) {
				customFields[id] = {
					id,
				} as CustomField;
			}

			if (key === `custom-label-${id}`) {
				customFields[id].label = value?.toString();
			} else if (key === `custom-content-${id}`) {
				customFields[id].content = value?.toString();
			} else if (key === `custom-show-label-${id}`) {
				customFields[id].showLabel = value === 'on';
			}
		}
	}

	return customFields;
}

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
