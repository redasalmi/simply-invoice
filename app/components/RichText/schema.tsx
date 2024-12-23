import type * as React from 'react';
import { defineSchema, type BaseDefinition } from '@portabletext/editor';
import {
	BoldIcon,
	ItalicIcon,
	UnderlineIcon,
	LinkIcon,
	TypeIcon,
	Heading1Icon,
	Heading2Icon,
	Heading3Icon,
	QuoteIcon,
	ListIcon,
	ListOrderedIcon,
} from 'lucide-react';

export type SchemaDefinition = BaseDefinition & {
	icon: () => React.ReactNode;
};

export const schemaDefinition = defineSchema({
	decorators: [
		{ name: 'strong', icon: () => <BoldIcon width={16} height={16} /> },
		{ name: 'em', icon: () => <ItalicIcon width={16} height={16} /> },
		{ name: 'underline', icon: () => <UnderlineIcon width={16} height={16} /> },
	],
	annotations: [
		{ name: 'link', icon: () => <LinkIcon width={16} height={16} /> },
	],
	styles: [
		{ name: 'normal', icon: () => <TypeIcon width={16} height={16} /> },
		{ name: 'h1', icon: () => <Heading1Icon width={16} height={16} /> },
		{ name: 'h2', icon: () => <Heading2Icon width={16} height={16} /> },
		{ name: 'h3', icon: () => <Heading3Icon width={16} height={16} /> },
		{ name: 'blockquote', icon: () => <QuoteIcon width={16} height={16} /> },
	],
	lists: [
		{ name: 'bullet', icon: () => <ListIcon width={16} height={16} /> },
		{ name: 'number', icon: () => <ListOrderedIcon width={16} height={16} /> },
	],
});
