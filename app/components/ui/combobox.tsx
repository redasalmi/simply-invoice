import * as React from 'react';
import { useCombobox } from 'downshift';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { cn } from '~/utils/shared.utils';

type ComboBoxProps = {
	id: string;
	name: string;
	label: string;
	placeholder: string;
	errorMessage?: string;
	listItems: Array<{
		id: string;
		name: string;
		value: string;
	}>;
	inputChangeCallback?: (inputValue: string) => void;
};

export function ComboBox({
	id,
	name,
	label,
	placeholder,
	errorMessage,
	listItems,
	inputChangeCallback,
}: ComboBoxProps) {
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
		onInputValueChange({ inputValue }) {
			const lowerCasedInputValue = inputValue.toLowerCase();
			const filteredItems = listItems.filter(({ name }) => {
				return !inputValue || name.toLowerCase().includes(lowerCasedInputValue);
			});

			setItems(filteredItems);

			if (!inputValue) {
				reset();
			}

			if (inputChangeCallback) {
				inputChangeCallback(inputValue);
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
						value={selectedItem?.value || ''}
						hidden
						readOnly
					/>
					<input
						placeholder={placeholder}
						className="w-full p-1.5"
						{...getInputProps()}
					/>
					<button
						aria-label="toggle menu"
						className="px-2"
						type="button"
						{...getToggleButtonProps()}
					>
						{isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
					</button>
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
