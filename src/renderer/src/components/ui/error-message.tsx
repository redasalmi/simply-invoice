import { cn } from "@renderer/utils/cn";

export function ErrorMessage({
	className,
	...props
}: React.ComponentPropsWithRef<"p">) {
	return (
		<p
			className={cn("text-sm font-medium text-red-900", className)}
			data-invalid
			{...props}
		/>
	);
}
