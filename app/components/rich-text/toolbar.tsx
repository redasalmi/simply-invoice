import { useEditor, useEditorSelector } from '@portabletext/editor';
import {
	isActiveDecorator,
	isActiveAnnotation,
	isActiveStyle,
	isActiveListItem,
} from '@portabletext/editor/selectors';

import { Button } from '~/components/ui/button';
import { cn } from '~/utils/shared.utils';

import { schemaDefinition, type SchemaDefinition } from './schema';

type ToolbarButtonProps = SchemaDefinition & {
	active: boolean;
	onClick: () => void;
};

function ToolbarButton({ name, icon, active, onClick }: ToolbarButtonProps) {
	const editor = useEditor();

	return (
		<Button
			className={cn(
				'flex size-9 items-center justify-center p-0',
				active && 'bg-gray-500',
			)}
			aria-label={name}
			onClick={() => {
				onClick();
				editor.send({ type: 'focus' });
			}}
		>
			{icon()}
		</Button>
	);
}

function DecoratorButton(props: SchemaDefinition) {
	const editor = useEditor();
	const active = useEditorSelector(editor, isActiveDecorator(props.name));

	return (
		<ToolbarButton
			active={active}
			onClick={() => {
				editor.send({
					type: 'decorator.toggle',
					decorator: props.name,
				});
			}}
			{...props}
		/>
	);
}

function AnnotationButton(props: SchemaDefinition) {
	const editor = useEditor();
	const active = useEditorSelector(editor, isActiveAnnotation(props.name));

	return (
		<ToolbarButton
			active={active}
			onClick={() => {
				editor.send({
					type: 'annotation.toggle',
					annotation: {
						name: props.name,
						value: props.name === 'link' ? { href: 'https://example.com' } : {},
					},
				});
			}}
			{...props}
		/>
	);
}

function StyleButton(props: SchemaDefinition) {
	const editor = useEditor();
	const active = useEditorSelector(editor, isActiveStyle(props.name));

	return (
		<ToolbarButton
			active={active}
			onClick={() => {
				editor.send({ type: 'style.toggle', style: props.name });
			}}
			{...props}
		/>
	);
}

function ListButton(props: SchemaDefinition) {
	const editor = useEditor();
	const active = useEditorSelector(editor, isActiveListItem(props.name));

	return (
		<ToolbarButton
			active={active}
			onClick={() => {
				editor.send({
					type: 'list item.toggle',
					listItem: props.name,
				});
			}}
			{...props}
		/>
	);
}

function DecoratorButtons() {
	return schemaDefinition.decorators.map((decorator) => (
		<DecoratorButton key={decorator.name} {...decorator} />
	));
}

function AnnotationButtons() {
	return schemaDefinition.annotations.map((annotation) => (
		<AnnotationButton key={annotation.name} {...annotation} />
	));
}

function StyleButtons() {
	return schemaDefinition.styles.map((style) => (
		<StyleButton key={style.name} {...style} />
	));
}

function ListButtons() {
	return schemaDefinition.lists.map((list) => (
		<ListButton key={list.name} {...list} />
	));
}

export function Toolbar() {
	return (
		<div className="flex gap-2">
			<DecoratorButtons />
			<AnnotationButtons />
			<StyleButtons />
			<ListButtons />
		</div>
	);
}
