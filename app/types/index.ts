export type Field = {
	name: string;
	label: string;
	defaultValue: string;
};

export const intents = {
	preview: 'preview',
	download: 'download',
	save: 'save',
} as const;

export type Intent = (typeof intents)[keyof typeof intents];
