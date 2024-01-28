import { type InvoicePdfEntry } from '~/components';

export type Field = {
	key: string;
	name: string;
	label: string;
	value: string;
	showTitle: boolean;
};

export const intents = {
	preview: 'preview',
	download: 'download',
	save: 'save',
} as const;

export type Intent = (typeof intents)[keyof typeof intents];

export type Invoice = {
	id: string;
	customer: Array<InvoicePdfEntry>;
};
