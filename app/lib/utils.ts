import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import type { ParsedQuery } from 'query-string';
import { twMerge } from 'tailwind-merge';

import { CustomField } from '~/lib/types';

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
