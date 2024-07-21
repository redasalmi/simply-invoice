import { useSelect } from 'downshift';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { cn } from '~/utils/shared.utils';

type SelectProps = {
	id: string;
	name: string;
	label: string;
	placeholder: string;
	errorMessage?: string;
	listItems: Array<{
		id: string;
		name: string;
	}>;
	onSelectedItemChange?: (itemId: string) => void;
};

export function Select({
	id,
	name,
	label,
	placeholder,
	errorMessage,
	listItems,
	onSelectedItemChange,
}: SelectProps) {
	const {
		isOpen,
		selectedItem,
		getToggleButtonProps,
		getLabelProps,
		getMenuProps,
		highlightedIndex,
		getItemProps,
	} = useSelect({
		onSelectedItemChange({ selectedItem: newSelectedItem }) {
			if (onSelectedItemChange) {
				onSelectedItemChange(newSelectedItem.id);
			}
		},
		items: listItems,
		itemToString(item) {
			return item ? item.name : '';
		},
	});

	return (
		<div>
			<div className="flex w-72 flex-col gap-1">
				<label {...getLabelProps()}>{label}</label>
				<input
					id={id}
					type="text"
					name={name}
					value={selectedItem?.id || ''}
					hidden
					readOnly
				/>
				<div
					className="flex cursor-pointer justify-between bg-white p-2"
					{...getToggleButtonProps()}
				>
					<span>{selectedItem ? selectedItem.name : placeholder}</span>
					<span className="px-2">
						{isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
					</span>
				</div>
				{errorMessage ? <p>{errorMessage}</p> : null}
			</div>
			<ul
				className={`absolute z-10 mt-1 max-h-80 w-72 overflow-scroll bg-white p-0 shadow-md ${
					!isOpen && 'hidden'
				}`}
				{...getMenuProps()}
			>
				{isOpen &&
					listItems.map((item, index) => (
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
