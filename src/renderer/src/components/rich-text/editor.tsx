import {
	type EditorEmittedEvent,
	EditorProvider,
	type PortableTextBlock,
	PortableTextEditable,
} from "@portabletext/editor";
import { EventListenerPlugin } from "@portabletext/editor/plugins";
import { useState } from "react";
import {
	renderAnnotation,
	renderDecorator,
	renderStyle,
} from "~/renderer/components/rich-text/renderers";
import { schemaDefinition } from "~/renderer/components/rich-text/schema";
import { Toolbar } from "~/renderer/components/rich-text/toolbar";
import "~/renderer/components/rich-text/editor.css";

interface RichTextEditorProps {
	name: string;
	defaultValue?: Array<PortableTextBlock>;
}

export function RichTextEditor({ name, defaultValue }: RichTextEditorProps) {
	const [value, setValue] = useState(defaultValue);

	const handleEditorEvent = (event: EditorEmittedEvent) => {
		if (event.type === "mutation") {
			setValue(event.value);
		}
	};

	return (
		<EditorProvider
			initialConfig={{
				schemaDefinition,
				initialValue: value,
			}}
		>
			{value ? (
				<input name={name} type="hidden" value={JSON.stringify(value)} />
			) : null}

			<EventListenerPlugin on={handleEditorEvent} />
			<Toolbar />
			<PortableTextEditable
				className="my-2 min-h-32 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 text-sm focus:border-blue-500 focus:ring-blue-500"
				renderAnnotation={renderAnnotation}
				renderDecorator={renderDecorator}
				renderStyle={renderStyle}
			/>
		</EditorProvider>
	);
}
