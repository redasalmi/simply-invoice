import { useId } from 'react';
import { Field, Label, Select as UISelect } from '@headlessui/react';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '~/utils/shared.utils';

type SelectItem<T extends string> = Record<T, string> & { name: string };

type SelectProps<T extends string> = {
	name: string;
	label: string;
	defaultValue?: string | number | readonly string[];
	className?: string;
	itemIdKey: T;
	items: Array<SelectItem<T>>;
	errorMessage?: string;
	onChange?: (value: string) => void;
};

export function Select<T extends string>({
	name,
	label,
	className,
	defaultValue,
	itemIdKey,
	items,
	errorMessage,
	onChange,
}: SelectProps<T>) {
	const descriptionId = useId();
	const hasError = Boolean(errorMessage?.length);

	const handleOnChange = (
		event: React.ChangeEvent<HTMLSelectElement> | undefined,
	) => {
		if (!onChange || !event) {
			return;
		}

		onChange(event.target.value);
	};

	return (
		<Field className={className}>
			<Label className="mb-1 block text-sm font-medium text-gray-900">
				{label}
			</Label>
			<div className="relative">
				<UISelect
					name={name}
					defaultValue={defaultValue}
					aria-description={descriptionId}
					aria-invalid={hasError || undefined}
					data-invalid={hasError || undefined}
					className={cn(
						'block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500',
						'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
						'*:text-black',
						'data-[invalid]:bg-red-50 data-[invalid]:text-red-900 data-[invalid]:placeholder-red-700 data-[invalid]:focus:border-red-500 data-[invalid]:focus:ring-red-500 data-[invalid="true"]:border-red-500',
					)}
					onChange={handleOnChange}
				>
					{items.map((item) => (
						<option key={item[itemIdKey]} value={item[itemIdKey]}>
							{item.name}
						</option>
					))}
				</UISelect>
				<ChevronDownIcon
					aria-hidden
					className="group pointer-events-none absolute top-3.5 right-2.5 size-4 fill-white/60"
				/>
			</div>

			{errorMessage ? (
				<p data-invalid id={descriptionId} className="font-medium text-red-900">
					{errorMessage}
				</p>
			) : null}
		</Field>
	);
}
