import { cn } from "~/renderer/utils/cn";

export interface InputProps extends React.ComponentPropsWithRef<"input"> {}

export function Input({ className, ...props }: InputProps) {
	return (
		<input
			className={cn(
				"rounded-md border-2 border-gray-300 p-2 aria-invalid:border-red-900",
				className,
			)}
			{...props}
		/>
	);
}
