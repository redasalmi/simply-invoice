import * as React from 'react';

import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '~/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '~/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '~/components/ui/popover';

import { cn } from '~/lib/utils';

type ComboboxProps = {
	list: Array<{ value: string; label: string }>;
	label: string;
	inputName: string;
	inputPlaceholder: string;
	onSelectCallback?: (value: string) => void;
};

export const Combobox = ({
	label,
	inputName,
	inputPlaceholder,
	list,
	onSelectCallback,
}: ComboboxProps) => {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState('');

	const onSelect = (currentValue: string) => {
		const newValue =
			currentValue === value
				? ''
				: list.find((listItem) => listItem.label.toLowerCase() === currentValue)
						?.value || '';

		setValue(newValue);
		if (onSelectCallback) {
			onSelectCallback(newValue);
		}
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<input type="text" hidden readOnly name={inputName} value={value} />
			<p>{label}</p>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{value
						? list.find((listItem) => listItem.value === value)?.label
						: inputPlaceholder}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder={inputPlaceholder} />
					<CommandEmpty>No result found.</CommandEmpty>
					<CommandGroup className="max-h-72 overflow-y-auto">
						{list.map((listItem) => (
							<CommandItem
								key={listItem.value}
								value={listItem.label}
								onSelect={onSelect}
							>
								<Check
									className={cn(
										'mr-2 h-4 w-4',
										value === listItem.value ? 'opacity-100' : 'opacity-0',
									)}
								/>
								{listItem.label}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
};
