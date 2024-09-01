import type { FormFieldProps } from '~/components/FormField';

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

export const informationFields: Array<FormFieldProps> = [
	{
		id: 'name',
		label: 'Name',
		name: 'name',
		required: true,
	},
	{
		id: 'email',
		label: 'Email',
		name: 'email',
		type: 'email',
		required: true,
	},
];

export const addressFields: Array<FormFieldProps> = [
	{
		id: 'address-address1',
		label: 'Address 1',
		name: 'address-address1',
		required: true,
	},
	{
		id: 'address-address2',
		label: 'Address 2',
		name: 'address-address2',
		required: true,
	},
	{
		id: 'address-country',
		label: 'Country',
		name: 'address-country',
		required: true,
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
];

export const servicesFields: Array<FormFieldProps> = [
	{
		id: 'name',
		label: 'Name',
		name: 'name',
	},
	{
		id: 'description',
		label: 'Description',
		name: 'description',
	},
	{
		id: 'rate',
		label: 'Rate',
		name: 'rate',
		type: 'number',
	},
];
