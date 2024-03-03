export const idTypes = {
	incremental: 'incremental',
	random: 'random',
} as const;
export type IdType = (typeof idTypes)[keyof typeof idTypes];

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
