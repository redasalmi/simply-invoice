export const identifierTypes = {
	incremental: 'incremental',
	random: 'random',
} as const;
export type IdentifierType = keyof typeof identifierTypes;

export const identifierTypesList = [
	{
		id: identifierTypes.incremental,
		name: 'Incremental ID',
	},
	{
		id: identifierTypes.random,
		name: 'Random ID',
	},
];

export const locales = {
	'en-US': 'en-US',
	'fr-FR': 'fr-FR',
} as const;
export type Locale = keyof typeof locales;

export const localesList = [
	{
		id: locales['en-US'],
		name: 'English',
	},
	{
		id: locales['fr-FR'],
		name: 'French',
	},
];

export const intents = {
	preview: 'preview',
	download: 'download',
	save: 'save',
} as const;
export type Intent = keyof typeof intents;

export const addressFields = [
	{
		id: 'address-address1',
		label: 'Address 1',
		name: 'address-address1',
	},
	{
		id: 'address-address2',
		label: 'Address 2',
		name: 'address-address2',
	},
	{
		id: 'address-country',
		label: 'Country',
		name: 'address-country',
	},
	{
		id: 'address-province',
		label: 'Province',
		name: 'address-province',
	},
	{
		id: 'address-city',
		label: 'City',
		name: 'address-city',
	},
	{
		id: 'address-zip',
		label: 'Zip',
		name: 'address-zip',
	},
] as const;

export const companyFields = [
	{
		id: 'company-name',
		label: 'Name',
		name: 'company-name',
		type: 'text',
	},
	{
		id: 'company-email',
		label: 'Email',
		name: 'company-email',
		type: 'email',
	},
] as const;

export const customerFields = [
	{
		id: 'customer-name',
		label: 'Name',
		name: 'customer-name',
		type: 'text',
	},
	{
		id: 'customer-email',
		label: 'Email',
		name: 'customer-email',
		type: 'email',
	},
] as const;
