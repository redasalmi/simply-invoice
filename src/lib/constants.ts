export const idTypes = [
	{
		value: 'incremental',
		label: 'Incremental ID',
	},
	{
		value: 'random',
		label: 'Random ID',
	},
] as const;
export type IdType = (typeof idTypes)[number]['value'];

export const locales = [
	{
		value: 'en-US',
		label: 'English',
	},
	{
		value: 'fr-FR',
		label: 'French',
	},
] as const;
export type Locale = (typeof locales)[number]['value'];

export const intents = {
	preview: 'preview',
	download: 'download',
	save: 'save',
} as const;
export type Intent = (typeof intents)[keyof typeof intents];
