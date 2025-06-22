import { cn } from "@renderer/utils/cn";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

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
				type="button"
				tabIndex={-1}
				aria-label="Decrease"
				aria-controls={id}
				className={cn(
					"flex size-10 items-center justify-center rounded-tl-md rounded-bl-md border border-gray-200 bg-gray-50 bg-clip-padding text-gray-900 select-none hover:bg-gray-100 active:bg-gray-100",
					isInvalid && "border-red-900",
				)}
				onClick={() => onClick("minus")}
			>
				<Minus />
			</button>
			<input
				id={id}
				value={value}
				type="text"
				inputMode="numeric"
				autoComplete="off"
				autoCorrect="off"
				spellCheck={false}
				className={cn(
					"peer h-10 w-24 border-t border-b border-gray-200 text-center text-base text-gray-900 tabular-nums focus:z-1 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800 aria-invalid:border-red-900",
					className,
				)}
				onInput={onInput}
				{...props}
			/>
			<button
				type="button"
				tabIndex={-1}
				aria-label="Increase"
				aria-controls={id}
				className={cn(
					"flex size-10 items-center justify-center rounded-tr-md rounded-br-md border border-gray-200 bg-gray-50 bg-clip-padding text-gray-900 select-none hover:bg-gray-100 active:bg-gray-100",
					isInvalid && "border-red-900",
				)}
				onClick={() => onClick("plus")}
			>
				<Plus />
			</button>
		</div>
	);
}
