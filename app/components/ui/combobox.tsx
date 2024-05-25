import * as React from 'react';
import {
	Combobox,
	ComboboxButton,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
	Transition,
} from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { cn } from '~/utils/shared';

export type Option = {
	id: string;
	name: string;
};

type Props = React.ComponentPropsWithoutRef<'div'> & {
	input: React.ComponentPropsWithoutRef<'input'>;
	options: Array<Option>;
	onChangeCallback?: (option: Option | null) => void;
};

export function ComboBox({
	className,
	options,
	input,
	onChangeCallback,
	...props
}: Props) {
	const [query, setQuery] = React.useState('');
	const [selected, setSelected] = React.useState<Option | null>(null);

	const filteredOptions =
		query === ''
			? options
			: options.filter((option) => {
					return option.name.toLowerCase().includes(query.toLowerCase());
				});

	const handleOnChange = (option: Option | null) => {
		setSelected(option);

		if (onChangeCallback) {
			onChangeCallback(option);
		}
	};

	return (
		<div className={cn('w-52', className)} {...props}>
			<Combobox value={selected} onChange={handleOnChange}>
				<div className="relative">
					<ComboboxInput
						className="w-full rounded-lg border bg-white/5 py-1.5 pl-3 pr-8 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
						displayValue={(option) => option?.name}
						onChange={(event) => setQuery(event.target.value)}
						{...input}
					/>
					<ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
						<ChevronDownIcon className="size-4" />
					</ComboboxButton>
				</div>
				<Transition
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					afterLeave={() => setQuery('')}
				>
					<ComboboxOptions
						anchor="bottom"
						className="mt-1 !max-h-96 w-[var(--input-width)] rounded-xl border bg-white/5 [--anchor-gap:var(--spacing-1)] empty:hidden"
					>
						{filteredOptions.map((option) => (
							<ComboboxOption
								key={option.id}
								value={option}
								className="group z-50 flex cursor-default select-none items-center gap-2 rounded-lg bg-white px-3 py-1.5"
							>
								<div className="text-sm/6 text-black">{option.name}</div>
								<CheckIcon className="invisible size-4 group-data-[selected]:visible" />
							</ComboboxOption>
						))}
					</ComboboxOptions>
				</Transition>
			</Combobox>
		</div>
	);
}
