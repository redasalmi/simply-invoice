import React, { useId, useState } from 'react';
import {
	Field,
	Label,
	Combobox as UICombobox,
	ComboboxButton,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
} from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { cn } from '~/utils/shared.utils';

export type ComboboxItem<T> = T & {
	name: string;
};

type ComboboxProps<T> = {
	name: string;
	label: string;
	hideLabel?: boolean;
	defaultValue?: string;
	placeholder?: string;
	className?: string;
	itemIdKey: keyof T;
	items: Array<ComboboxItem<T>>;
	renderItemName?: (item: T) => React.ReactNode;
	errorMessage?: string;
	onChange?: (value: ComboboxItem<T> | null) => void;
};

export function Combobox<T>({
	name,
	label,
	hideLabel,
	defaultValue,
	placeholder,
	className,
	itemIdKey,
	items,
	renderItemName,
	errorMessage,
	onChange,
}: ComboboxProps<T>) {
	const descriptionId = useId();
	const [query, setQuery] = useState('');
	const [selectedItem, setSelectedItem] = useState<ComboboxItem<T> | null>(
		() => {
			if (!defaultValue) {
				return null;
			}

			return items.find((item) => item[itemIdKey] === defaultValue) || null;
		},
	);

	const hasError = Boolean(errorMessage?.length);

	const filteredItems =
		query === ''
			? items
			: items.filter((item) => {
					return item.name.toLowerCase().includes(query.toLowerCase());
				});

	const handleOnChange = (value: ComboboxItem<T> | null) => {
		setSelectedItem(value);

		if (onChange) {
			onChange(value);
		}
	};

	return (
		<Field className={className}>
			<input
				type="hidden"
				name={name}
				value={(selectedItem?.[itemIdKey] as string | undefined) || ''}
			/>

			<Label
				className={cn(
					'mb-1 block text-sm font-medium text-gray-900',
					hideLabel && 'sr-only',
				)}
			>
				{label}
			</Label>
			<UICombobox
				value={selectedItem}
				onChange={handleOnChange}
				onClose={() => setQuery('')}
			>
				<div className="relative">
					<ComboboxInput
						placeholder={placeholder}
						aria-describedby={descriptionId}
						aria-invalid={hasError || undefined}
						data-invalid={hasError || undefined}
						className={cn(
							'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500',
							'data-[invalid]:bg-red-50 data-[invalid]:text-red-900 data-[invalid]:placeholder-red-700 data-[invalid]:focus:border-red-500 data-[invalid]:focus:ring-red-500 data-[invalid="true"]:border-red-500',
						)}
						displayValue={(item) =>
							item && renderItemName ? renderItemName(item as T) : item?.name
						}
						onChange={(event) => setQuery(event.target.value)}
					/>

					<ComboboxButton className="group absolute inset-y-0 right-0 cursor-pointer px-2.5">
						<ChevronDownIcon className="size-4 fill-white/60 group-data-[hover]:fill-white" />
					</ComboboxButton>
				</div>

				{errorMessage ? (
					<p
						data-invalid
						id={descriptionId}
						className="font-medium text-red-900"
					>
						{errorMessage}
					</p>
				) : null}

				<ComboboxOptions
					anchor="bottom"
					transition
					className={cn(
						'w-[var(--input-width)] rounded-xl border border-white/5 bg-gray-50 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible',
						'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0',
					)}
				>
					{filteredItems.map((item) => (
						<ComboboxOption
							key={item[itemIdKey] as string}
							value={item}
							className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-[focus]:bg-white/10"
						>
							<CheckIcon className="invisible size-4 text-gray-900 group-data-[selected]:visible" />
							<div className="text-sm/6 text-gray-900">
								{renderItemName ? renderItemName(item) : item.name}
							</div>
						</ComboboxOption>
					))}
				</ComboboxOptions>
			</UICombobox>
		</Field>
	);
}
