import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
