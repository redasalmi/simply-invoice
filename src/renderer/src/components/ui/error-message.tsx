import { cn } from "~/renderer/utils/cn";

export interface ErrorMessageProps
	extends Omit<React.ComponentPropsWithRef<"p">, "data-invalid"> {}

export function ErrorMessage({ className, ...props }: ErrorMessageProps) {
	return (
		<p
			className={cn("font-medium text-red-900 text-sm", className)}
			data-invalid
			{...props}
		/>
	);
}
