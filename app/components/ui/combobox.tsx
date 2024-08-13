import * as React from 'react';
import { useCombobox } from 'downshift';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { cn } from '~/utils/shared.utils';
import { Button } from '~/components/ui/button';

type ComboboxProps = {
	id: string;
	name: string;
	label: string;
	placeholder: string;
	errorMessage?: string;
	listItems: Array<{
		id: string;
		name: string;
	}>;
	inputValueChangeCallback?: (itemId?: string) => void;
};

export function Combobox({
	id,
	name,
	label,
	placeholder,
	errorMessage,
	listItems,
	inputValueChangeCallback,
}: ComboboxProps) {
	const [items, setItems] = React.useState(listItems);
	const {
		isOpen,
		getToggleButtonProps,
		getLabelProps,
		getMenuProps,
		getInputProps,
		highlightedIndex,
		getItemProps,
		selectedItem,
		reset,
	} = useCombobox({
		onInputValueChange({ inputValue, selectedItem: newSelectedItem }) {
			const lowerCasedInputValue = inputValue.toLowerCase();
			const filteredItems = listItems.filter(({ name }) => {
				return !inputValue || name.toLowerCase().includes(lowerCasedInputValue);
			});

			setItems(filteredItems);

			if (!inputValue) {
				reset();
			}

			if (inputValueChangeCallback) {
				inputValueChangeCallback(inputValue ? newSelectedItem?.id : undefined);
			}
		},
		items,
		itemToString(item) {
			return item ? item.name : '';
		},
	});

	return (
		<div>
			<div className="flex w-72 flex-col gap-1">
				<label className="w-fit" {...getLabelProps()}>
					{label}
				</label>
				<div className="flex gap-0.5 bg-white shadow-sm">
					<input
						id={id}
						type="text"
						name={name}
						value={selectedItem?.id || ''}
						hidden
						readOnly
					/>
					<input
						placeholder={placeholder}
						className="w-full p-1.5"
						{...getInputProps()}
					/>
					<Button
						aria-label="toggle menu"
						variant="icon"
						className="border-none px-2 hover:bg-transparent hover:text-blue-700 focus:ring-0"
						{...getToggleButtonProps()}
					>
						{isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
					</Button>
				</div>
				{errorMessage ? <p>{errorMessage}</p> : null}
			</div>
			<ul
				className={`absolute z-10 mt-1 max-h-80 w-72 overflow-scroll bg-white p-0 shadow-md ${
					!(isOpen && items.length) && 'hidden'
				}`}
				{...getMenuProps()}
			>
				{isOpen &&
					items.map((item, index) => (
						<li
							className={cn(
								highlightedIndex === index && 'bg-blue-300',
								selectedItem === item && 'font-bold',
								'flex flex-col px-3 py-2 shadow-sm',
							)}
							key={item.id}
							{...getItemProps({ item, index })}
						>
							{item.name}
						</li>
					))}
			</ul>
		</div>
	);
}
