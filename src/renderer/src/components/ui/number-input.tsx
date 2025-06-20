import { cn } from "@renderer/utils/cn";
import { Minus, Plus } from "lucide-react";

interface NumberInputProps
	extends Omit<
		React.ComponentPropsWithRef<"input">,
		"type" | "inputMode" | "autoComplete" | "autoCorrect" | "spellCheck"
	> {
	id: string;
}

export function NumberInput({ id, className, ...props }: NumberInputProps) {
	return (
		<div className="flex items-center">
			<button
				type="button"
				tabIndex={-1}
				aria-label="Decrease"
				aria-controls={id}
				className="flex size-10 items-center justify-center rounded-tl-md rounded-bl-md border border-gray-200 bg-gray-50 bg-clip-padding text-gray-900 select-none hover:bg-gray-100 active:bg-gray-100"
			>
				<Minus />
			</button>
			<input
				{...props}
				id={id}
				type="text"
				inputMode="numeric"
				autoComplete="off"
				autoCorrect="off"
				spellCheck={false}
				className={cn(
					"h-10 w-24 border-t border-b border-gray-200 text-center text-base text-gray-900 tabular-nums focus:z-1 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800",
					className,
				)}
			/>
			<button
				type="button"
				tabIndex={-1}
				aria-label="Increase"
				aria-controls={id}
				className="flex size-10 items-center justify-center rounded-tr-md rounded-br-md border border-gray-200 bg-gray-50 bg-clip-padding text-gray-900 select-none hover:bg-gray-100 active:bg-gray-100"
			>
				<Plus />
			</button>
		</div>
	);
}
