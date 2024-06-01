import type { FormFieldProps } from '~/types/formField.types';

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
		name: 'name',
		label: 'Name *',
		required: true,
	},
	{
		type: 'email',
		id: 'email',
		name: 'email',
		label: 'Email *',
		required: true,
	},
];

export const addressFields: Array<FormFieldProps> = [
	{
		id: 'address-address1',
		name: 'address-address1',
		label: 'Address 1 *',
		required: true,
	},
	{
		id: 'address-address2',
		name: 'address-address2',
		label: 'Address 2',
	},
	{
		id: 'address-country',
		name: 'address-country',
		label: 'Country *',
		required: true,
	},
	{
		id: 'address-province',
		name: 'address-province',
		label: 'Province',
	},
	{
		id: 'address-city',
		name: 'address-city',
		label: 'City',
	},
	{
		id: 'address-zip',
		name: 'address-zip',
		label: 'Zip',
	},
];

export const servicesFields: Array<FormFieldProps> = [
	{
		id: 'name',
		label: 'Name *',
		name: 'name',
		required: true,
	},
	{
		id: 'description',
		label: 'Description',
		name: 'description',
	},
	{
		type: 'number',
		id: 'rate',
		label: 'Rate *',
		name: 'rate',
		required: true,
	},
];
