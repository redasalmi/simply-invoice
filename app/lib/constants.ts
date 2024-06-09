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
		label: {
			children: 'Name *',
		},
		input: {
			name: 'name',
			required: true,
		},
	},
	{
		id: 'email',
		label: {
			children: 'Email *',
		},
		input: {
			type: 'email',
			name: 'email',
			required: true,
		},
	},
];

export const addressFields: Array<FormFieldProps> = [
	{
		id: 'address-address1',
		label: {
			children: 'Address 1 *',
		},
		input: {
			name: 'address-address1',
			required: true,
		},
	},
	{
		id: 'address-address2',
		label: {
			children: 'Address 2',
		},
		input: {
			name: 'address-address2',
		},
	},
	{
		id: 'address-country',
		label: {
			children: 'Country *',
		},
		input: {
			name: 'address-country',
			required: true,
		},
	},
	{
		id: 'address-province',
		label: {
			children: 'Province',
		},
		input: {
			name: 'address-province',
		},
	},
	{
		id: 'address-city',
		label: {
			children: 'City',
		},
		input: {
			name: 'address-city',
		},
	},
	{
		id: 'address-zip',
		label: {
			children: 'Zip',
		},
		input: {
			name: 'address-zip',
		},
	},
];

export const servicesFields: Array<FormFieldProps> = [
	{
		id: 'name',
		label: {
			children: 'Name *',
		},
		input: {
			name: 'name',
			required: true,
		},
	},
	{
		id: 'description',
		label: {
			children: 'Description',
		},
		input: {
			name: 'description',
		},
	},
	{
		id: 'rate',
		label: {
			children: 'Rate *',
		},
		input: {
			type: 'number',
			name: 'rate',
			required: true,
		},
	},
];
