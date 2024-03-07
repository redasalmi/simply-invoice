export const idTypes = [
	{
		label: 'Incremental ID',
		value: 'incremental',
	},
	{
		label: 'Random ID',
		value: 'random',
	},
] as const;
export type IdType = (typeof idTypes)[number]['value'];

export const locales = [
	{
		label: 'English',
		value: 'en-US',
	},
	{
		label: 'French',
		value: 'fr-FR',
	},
] as const;
export type Locale = (typeof locales)[number]['value'];
