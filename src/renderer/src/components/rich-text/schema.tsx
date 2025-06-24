import { type BaseDefinition, defineSchema } from "@portabletext/editor";
import {
	BoldIcon,
	Heading1Icon,
	Heading2Icon,
	Heading3Icon,
	ItalicIcon,
	LinkIcon,
	ListIcon,
	ListOrderedIcon,
	QuoteIcon,
	TypeIcon,
	UnderlineIcon,
} from "lucide-react";

export interface SchemaDefinition extends BaseDefinition {
	icon: () => React.ReactNode;
}

export const schemaDefinition = defineSchema({
	decorators: [
		{ name: "strong", icon: () => <BoldIcon height={16} width={16} /> },
		{ name: "em", icon: () => <ItalicIcon height={16} width={16} /> },
		{ name: "underline", icon: () => <UnderlineIcon height={16} width={16} /> },
	],
	annotations: [
		{ name: "link", icon: () => <LinkIcon height={16} width={16} /> },
	],
	styles: [
		{ name: "normal", icon: () => <TypeIcon height={16} width={16} /> },
		{ name: "h1", icon: () => <Heading1Icon height={16} width={16} /> },
		{ name: "h2", icon: () => <Heading2Icon height={16} width={16} /> },
		{ name: "h3", icon: () => <Heading3Icon height={16} width={16} /> },
		{ name: "blockquote", icon: () => <QuoteIcon height={16} width={16} /> },
	],
	lists: [
		{ name: "bullet", icon: () => <ListIcon height={16} width={16} /> },
		{ name: "number", icon: () => <ListOrderedIcon height={16} width={16} /> },
	],
});
