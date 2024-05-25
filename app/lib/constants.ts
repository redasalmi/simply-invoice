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
