import type { FormFieldProps } from '~/components/FormField';

export const idTypes = [
	{
		id: 'incremental',
		name: 'Incremental ID',
	},
	{
		id: 'random',
		name: 'Random ID',
	},
] as const;
export type IdType = (typeof idTypes)[number]['id'];

export const locales = [
	{
		id: 'en-US',
		name: 'English',
	},
	{
		id: 'fr-FR',
		name: 'French',
	},
] as const;
export type Locale = (typeof locales)[number]['id'];

export const intents = {
	preview: 'preview',
	download: 'download',
	save: 'save',
} as const;
export type Intent = (typeof intents)[keyof typeof intents];

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
		required: true,
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
		required: true,
	},
];
