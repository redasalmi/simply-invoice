import {
	type ComboBoxProps,
	type ListBoxItemProps,
	type ValidationResult,
	FieldError,
	Button,
	ComboBox,
	Input,
	Label,
	ListBox,
	ListBoxItem,
	Popover,
	Text,
	Group,
} from 'react-aria-components';
import { twMerge } from 'tailwind-merge';

interface MyComboBoxProps<T extends object>
	extends Omit<ComboBoxProps<T>, 'children'> {
	label?: string;
	description?: string | null;
	errorMessage?: string | ((validation: ValidationResult) => string);
	children: React.ReactNode | ((item: T) => React.ReactNode);
}

export function MyComboBox<T extends object>({
	label,
	description,
	errorMessage,
	children,
	className,
	...props
}: MyComboBoxProps<T>) {
	return (
		<ComboBox
			className={twMerge('group flex min-w-[200px] flex-col gap-1', className)}
			{...props}
		>
			<Label className="cursor-default">{label}</Label>
			<Group className="flex rounded-lg bg-white bg-opacity-90 shadow-md ring-1 ring-black/10 transition focus-within:bg-opacity-100 focus-visible:ring-2 focus-visible:ring-black">
				<Input className="w-full flex-1 border-none bg-transparent px-3 py-2 text-base leading-5 text-gray-900 outline-none" />
				<Button className="pressed:bg-sky-100 flex items-center rounded-r-lg border-0 border-l border-solid border-l-sky-200 bg-transparent px-3 text-gray-700 transition">
					▼
				</Button>
			</Group>
			{description ? <Text slot="description">{description}</Text> : null}
			{errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
			<Popover className="entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out max-h-60 w-[--trigger-width] overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black/5">
				<ListBox className="p-1 outline-none">{children}</ListBox>
			</Popover>
		</ComboBox>
	);
}

export function MyComboBoxListBoxItem({
	className,
	...props
}: ListBoxItemProps) {
	return (
		<ListBoxItem
			className={twMerge(
				'group flex cursor-default select-none items-center gap-2 rounded py-2 pl-2 pr-4 text-gray-900 outline-none focus:bg-sky-600 focus:text-white',
				className,
			)}
			{...props}
		/>
	);
}
