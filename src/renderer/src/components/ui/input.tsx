import { cn } from "@renderer/utils/cn";

export function Input({
	className,
	...props
}: React.ComponentPropsWithRef<"input">) {
	return (
		<input
			className={cn("border-2 border-gray-300 rounded-md p-2", className)}
			{...props}
		/>
	);
}
