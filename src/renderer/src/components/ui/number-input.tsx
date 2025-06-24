import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "~/renderer/utils/cn";

export interface NumberInputProps
	extends Omit<
		React.ComponentPropsWithRef<"input">,
		| "type"
		| "inputMode"
		| "autoComplete"
		| "autoCorrect"
		| "spellCheck"
		| "id"
		| "value"
		| "onInput"
	> {
	id: string;
}

export function NumberInput({
	id,
	className,
	defaultValue,
	...props
}: NumberInputProps) {
	const [value, setValue] = useState<string>(defaultValue?.toString() ?? "");
	const isInvalid =
		props["aria-invalid"] === "true" || props["aria-invalid"] === true;

	const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (!value) {
			e.preventDefault();
			setValue("");

			return;
		}

		const isNumber = /^\d+$/.test(value);
		const isDecimal = /^\d*\.\d*$/.test(value);
		if (!isNumber && !isDecimal) {
			e.preventDefault();

			return;
		}

		setValue(value);
	};

	const onClick = (action: "plus" | "minus") => {
		setValue((prev) => {
			const newValue = action === "plus" ? Number(prev) + 1 : Number(prev) - 1;

			return newValue.toString();
		});
	};

	return (
		<div className="flex items-center">
			<button
				aria-controls={id}
				aria-label="Decrease"
				className={cn(
					"flex size-10 select-none items-center justify-center rounded-tl-md rounded-bl-md border border-gray-200 bg-gray-50 bg-clip-padding text-gray-900 hover:bg-gray-100 active:bg-gray-100",
					isInvalid && "border-red-900",
				)}
				onClick={() => onClick("minus")}
				tabIndex={-1}
				type="button"
			>
				<Minus />
			</button>
			<input
				autoComplete="off"
				autoCorrect="off"
				className={cn(
					"peer focus:-outline-offset-1 h-10 w-24 border-gray-200 border-t border-b text-center text-base text-gray-900 tabular-nums focus:z-1 focus:outline-2 focus:outline-blue-800 aria-invalid:border-red-900",
					className,
				)}
				id={id}
				inputMode="numeric"
				onInput={onInput}
				spellCheck={false}
				type="text"
				value={value}
				{...props}
			/>
			<button
				aria-controls={id}
				aria-label="Increase"
				className={cn(
					"flex size-10 select-none items-center justify-center rounded-tr-md rounded-br-md border border-gray-200 bg-gray-50 bg-clip-padding text-gray-900 hover:bg-gray-100 active:bg-gray-100",
					isInvalid && "border-red-900",
				)}
				onClick={() => onClick("plus")}
				tabIndex={-1}
				type="button"
			>
				<Plus />
			</button>
		</div>
	);
}
