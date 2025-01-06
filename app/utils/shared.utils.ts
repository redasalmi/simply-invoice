import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { countries, type CountryCode } from '~/lib/countries';

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
	const opt = Object.assign(
		{},
		{ month: 'long', day: '2-digit', year: 'numeric' },
		options,
	);
	const formatter = new Intl.DateTimeFormat(locale, opt);

	return formatter;
}

export function formatMoney(
	amount: number,
	currencyCountryCode: CountryCode,
	locale: string = 'en-Us',
) {
	const country = countries.find(
		({ countryCode }) => countryCode === currencyCountryCode,
	);
	if (!country) {
		return null;
	}

	const money = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: country.currencyCode,
	}).format(amount);

	return money;
}
