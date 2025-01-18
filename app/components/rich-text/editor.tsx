import { useState } from 'react';
import {
	EditorEventListener,
	EditorProvider,
	PortableTextEditable,
	type EditorEmittedEvent,
	type PortableTextBlock,
} from '@portabletext/editor';

import { schemaDefinition } from './schema';
import { Toolbar } from './toolbar';
import { renderAnnotation, renderDecorator, renderStyle } from './renderers';

import './editor.css';

type EditorValue = Array<PortableTextBlock>;
interface RichTextEditorProps {
	name: string;
	initialValue?: EditorValue;
}

export function RichTextEditor({ name, initialValue }: RichTextEditorProps) {
	const [value, setValue] = useState<EditorValue | undefined>(
		() => initialValue,
	);

	const handleEditorEvent = (event: EditorEmittedEvent) => {
		if (event.type === 'mutation') {
			setValue(event.value || []);
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
				<input type="hidden" name={name} value={JSON.stringify(value)} />
			) : null}

			<EditorEventListener on={handleEditorEvent} />
			<Toolbar />
			<PortableTextEditable
				className="my-2 min-h-32 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
				renderDecorator={renderDecorator}
				renderAnnotation={renderAnnotation}
				renderStyle={renderStyle}
			/>
		</EditorProvider>
	);
}
