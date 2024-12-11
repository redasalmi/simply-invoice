import { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
	$getSelection,
	$isRangeSelection,
	CAN_REDO_COMMAND,
	CAN_UNDO_COMMAND,
	FORMAT_ELEMENT_COMMAND,
	FORMAT_TEXT_COMMAND,
	REDO_COMMAND,
	SELECTION_CHANGE_COMMAND,
	UNDO_COMMAND,
} from 'lexical';
import {
	AlignCenterIcon,
	AlignJustifyIcon,
	AlignLeftIcon,
	AlignRightIcon,
	BoldIcon,
	ItalicIcon,
	RedoIcon,
	StrikethroughIcon,
	UnderlineIcon,
	UndoIcon,
} from 'lucide-react';
import { cn } from '~/utils/shared.utils';
import { Button } from '~/components/ui/button';

const lowPriority = 1;

function Divider() {
	return <div className="border-1 border-gray-200" />;
}

export function ToolbarPlugin() {
	const [editor] = useLexicalComposerContext();
	const [canUndo, setCanUndo] = useState(false);
	const [canRedo, setCanRedo] = useState(false);
	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isUnderline, setIsUnderline] = useState(false);
	const [isStrikethrough, setIsStrikethrough] = useState(false);

	useEffect(() => {
		const $updateToolbar = () => {
			const selection = $getSelection();
			if ($isRangeSelection(selection)) {
				setIsBold(selection.hasFormat('bold'));
				setIsItalic(selection.hasFormat('italic'));
				setIsUnderline(selection.hasFormat('underline'));
				setIsStrikethrough(selection.hasFormat('strikethrough'));
			}
		};

		return mergeRegister(
			editor.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					$updateToolbar();
				});
			}),
			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				() => {
					$updateToolbar();
					return false;
				},
				lowPriority,
			),
			editor.registerCommand(
				CAN_UNDO_COMMAND,
				(payload) => {
					setCanUndo(payload);
					return false;
				},
				lowPriority,
			),
			editor.registerCommand(
				CAN_REDO_COMMAND,
				(payload) => {
					setCanRedo(payload);
					return false;
				},
				lowPriority,
			),
		);
	}, [editor]);

	return (
		<div className="flex gap-2 border-b-1 border-gray-200 px-4">
			<Button
				variant="icon"
				disabled={!canUndo}
				onClick={() => {
					editor.dispatchCommand(UNDO_COMMAND, undefined);
				}}
				aria-label="Undo"
				className={cn('my-2 cursor-pointer', !canUndo && 'cursor-not-allowed')}
			>
				<UndoIcon />
			</Button>
			<Button
				variant="icon"
				disabled={!canRedo}
				onClick={() => {
					editor.dispatchCommand(REDO_COMMAND, undefined);
				}}
				aria-label="Redo"
				className={cn('my-2 cursor-pointer', !canRedo && 'cursor-not-allowed')}
			>
				<RedoIcon />
			</Button>
			<Divider />
			<Button
				variant="icon"
				onClick={() => {
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
				}}
				aria-label="Format Bold"
				className={cn('my-2', isBold && 'active')}
			>
				<BoldIcon />
			</Button>
			<Button
				variant="icon"
				onClick={() => {
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
				}}
				aria-label="Format Italics"
				className={cn('my-2', isItalic && 'active')}
			>
				<ItalicIcon />
			</Button>
			<Button
				variant="icon"
				onClick={() => {
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
				}}
				aria-label="Format Underline"
				className={cn('my-2', isUnderline && 'active')}
			>
				<UnderlineIcon />
			</Button>
			<Button
				variant="icon"
				onClick={() => {
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
				}}
				className={cn('my-2', isStrikethrough && 'active')}
				aria-label="Format Strikethrough"
			>
				<StrikethroughIcon />
			</Button>
			<Divider />
			<Button
				variant="icon"
				onClick={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
				}}
				aria-label="Left Align"
				className="my-2"
			>
				<AlignLeftIcon />
			</Button>
			<Button
				variant="icon"
				onClick={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
				}}
				aria-label="Center Align"
				className="my-2"
			>
				<AlignCenterIcon />
			</Button>
			<Button
				variant="icon"
				onClick={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
				}}
				aria-label="Right Align"
				className="my-2"
			>
				<AlignRightIcon />
			</Button>
			<Button
				variant="icon"
				onClick={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
				}}
				aria-label="Justify Align"
				className="my-2"
			>
				<AlignJustifyIcon />
			</Button>
		</div>
	);
}
