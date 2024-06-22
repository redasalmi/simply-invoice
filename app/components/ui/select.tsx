import {
	type ListBoxItemProps,
	type SelectProps,
	type ValidationResult,
	Text,
	Button,
	FieldError,
	Label,
	ListBox,
	ListBoxItem,
	Popover,
	Select,
	SelectValue,
} from 'react-aria-components';
import { twMerge } from 'tailwind-merge';

interface MySelectProps<T extends object>
	extends Omit<SelectProps<T>, 'children'> {
	label: string;
	description?: string;
	errorMessage?: string | ((validation: ValidationResult) => string);
	items?: Iterable<T>;
	children: React.ReactNode | ((item: T) => React.ReactNode);
}

export function MySelect<T extends object>({
	label,
	description,
	errorMessage,
	children,
	items,
	className,
	...props
}: MySelectProps<T>) {
	return (
		<Select
			className={twMerge('flex min-w-[200px] flex-col gap-1', className)}
			{...props}
		>
			<Label className="cursor-default">{label}</Label>
			<Button className="pressed:bg-opacity-100 flex cursor-default items-center rounded-lg border-0 bg-white bg-opacity-90 py-2 pl-5 pr-2 text-left text-base leading-normal text-gray-700 shadow-md ring-white ring-offset-2 ring-offset-rose-700 transition focus:outline-none focus-visible:ring-2">
				<SelectValue className="flex-1 truncate placeholder-shown:italic" />
				<span aria-hidden="true">▼</span>
			</Button>
			{description ? <Text slot="description">{description}</Text> : null}
			{errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
			<Popover className="entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out max-h-60 w-[--trigger-width] overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black/5">
				<ListBox className="p-1 outline-none" items={items}>
					{children}
				</ListBox>
			</Popover>
		</Select>
	);
}

export function MySelectListBoxItem({ className, ...props }: ListBoxItemProps) {
	return (
		<ListBoxItem
			className={twMerge(
				'group flex cursor-default select-none items-center gap-2 rounded px-4 py-2 text-gray-900 outline-none focus:bg-rose-600 focus:text-white',
				className,
			)}
			{...props}
		/>
	);
}
