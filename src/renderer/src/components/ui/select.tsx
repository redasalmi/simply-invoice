import { type UseSelectProps, useSelect } from "downshift";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useId } from "react";
import { ErrorMessage } from "~/renderer/components/ui/error-message";
import { Label } from "~/renderer/components/ui/label";
import { cn } from "~/renderer/utils/cn";

interface Item {
	id: string;
	label: string;
	value: string;
}

interface SelectProps extends UseSelectProps<Item> {
	name: string;
	label: string;
	errors?: Array<string>;
}

export function Select({ label, name, errors, ...selectProps }: SelectProps) {
	const {
		isOpen,
		selectedItem,
		getToggleButtonProps,
		getLabelProps,
		getMenuProps,
		highlightedIndex,
		getItemProps,
	} = useSelect(selectProps);
	const errorId = useId();
	const hasErrors = Boolean(errors?.length);

	return (
		<div>
			<input name={name} type="hidden" value={selectedItem?.value} />
			<div className="flex w-72 flex-col gap-1">
				<Label {...getLabelProps()}>{label}</Label>
				<div
					className="flex cursor-pointer justify-between bg-white p-2"
					{...getToggleButtonProps()}
					aria-describedby={hasErrors ? errorId : undefined}
					aria-invalid={hasErrors}
				>
					<span>{selectedItem ? selectedItem.label : "Select an option"}</span>
					<span className="px-2">
						{isOpen ? <ChevronUp /> : <ChevronDown />}
					</span>
				</div>
			</div>

			<ul
				className={cn(
					"absolute z-10 mt-1 max-h-80 w-72 overflow-scroll bg-white p-0 shadow-md",
					!isOpen && "hidden",
				)}
				{...getMenuProps()}
			>
				{isOpen
					? selectProps.items.map((item, index) => (
							<li
								className={cn(
									highlightedIndex === index && "bg-blue-300",
									selectedItem?.value === item.value && "font-bold",
									"flex flex-col px-3 py-2 shadow-sm",
								)}
								key={item.id}
								{...getItemProps({ item, index })}
							>
								<span>{item.label}</span>
							</li>
						))
					: null}
			</ul>

			{errors?.length ? (
				<ErrorMessage id={errorId}>
					{errors.map((error) => (
						<span
							className="block"
							key={`${error.replace(/\s/g, "-")}-${errorId}`}
						>
							{error}
						</span>
					))}
				</ErrorMessage>
			) : null}
		</div>
	);
}
