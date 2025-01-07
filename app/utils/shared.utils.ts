import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { countries } from '~/lib/countries';

export function cn(...inputs: Array<ClassValue>) {
	return twMerge(clsx(inputs));
}

export function capitalize(text: string) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

export function dateFormatter(
	locale: string = 'en-Us',
	options?: Intl.DateTimeFormatOptions,
) {
	const opt = Object.assign({}, options, {
		month: 'long',
		day: '2-digit',
		year: 'numeric',
	});
	const formatter = new Intl.DateTimeFormat(locale, opt);

	return formatter;
}

type FormatMoneyInput = {
	amount: number;
	locale?: string;
	options?: Intl.NumberFormatOptions;
};

export function formatMoney({ amount, locale, options }: FormatMoneyInput) {
	const country = options?.currency
		? countries.find(({ countryCode }) => countryCode === options.currency)
		: null;

	const opt = Object.assign({}, options, {
		style: 'currency',
		maximumFractionDigits: 2,
		currency: country?.currencyCode,
	});

	const money = new Intl.NumberFormat(locale || 'en-Us', opt).format(amount);

	return money;
}
