export const idTypes = {
	incremental: 'incremental',
	random: 'random',
} as const;
export type IdType = keyof typeof idTypes;

export const idTypesList = [
	{
		id: idTypes.incremental,
		name: 'Incremental ID',
	},
	{
		id: idTypes.random,
		name: 'Random ID',
	},
];

const locales = {
	enUS: 'en-US',
	frFR: 'fr-FR',
} as const;
export type Locale = keyof typeof locales;

export const localesList = [
	{
		id: locales.enUS,
		name: 'English',
	},
	{
		id: locales.frFR,
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
