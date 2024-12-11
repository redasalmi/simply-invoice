import {
	LexicalComposer,
	type InitialConfigType,
} from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ParagraphNode, TextNode } from 'lexical';
import { ToolbarPlugin } from '~/components/RichTextEditor/ToolbarPlugin';
import {
	constructImportMap,
	exportMap,
} from '~/components/RichTextEditor/utils';
import { theme } from '~/components/RichTextEditor/theme';

type EditorProps = {
	editorInitialConfig?: Pick<InitialConfigType, 'editable' | 'editorState'>;
	placeholder: string;
};

const editorConfig: InitialConfigType = {
	theme,
	html: {
		export: exportMap,
		import: constructImportMap(),
	},
	namespace: 'Rich Text Editor',
	nodes: [ParagraphNode, TextNode],
	onError(error: Error) {
		throw error;
	},
};

export function RichTextEditor({
	editorInitialConfig,
	placeholder,
}: EditorProps) {
	const initialConfig: InitialConfigType = Object.assign(
		editorConfig,
		editorInitialConfig,
	);

	return (
		<LexicalComposer initialConfig={initialConfig}>
			<div className="rounded-md border-1 border-gray-200 shadow">
				<ToolbarPlugin />
				<div className="relative bg-white px-4 py-2">
					<RichTextPlugin
						contentEditable={
							<ContentEditable
								aria-placeholder={placeholder}
								placeholder={
									<div className="pointer-events-none absolute inset-0 px-4 py-2 text-gray-500 select-none">
										{placeholder}
									</div>
								}
								className="min-h-40"
							/>
						}
						ErrorBoundary={LexicalErrorBoundary}
					/>
					<HistoryPlugin />
				</div>
			</div>
		</LexicalComposer>
	);
}
