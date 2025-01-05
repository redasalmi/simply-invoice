import { countries } from './countries';

export const currencies = countries.map(
	({ countryName, currencySymbol, countryCode }) => ({
		id: countryCode,
		name: `${countryName} - ${currencySymbol}`,
	}),
);
