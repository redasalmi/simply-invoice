export const idTypes = {
	incremental: 'incremental',
	random: 'random',
} as const;
export type IdTypes = (typeof idTypes)[keyof typeof idTypes];

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
export type Locales = (typeof locales)[number];
