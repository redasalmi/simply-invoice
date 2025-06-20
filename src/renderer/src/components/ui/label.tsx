import { cn } from "@renderer/utils/cn";

export function Label({
	className,
	...props
}: React.ComponentPropsWithRef<"label">) {
	// biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
	return <label className={cn("text-sm font-medium", className)} {...props} />;
}
