import { cn } from "@renderer/utils/cn";

export interface LabelProps extends React.ComponentPropsWithRef<"label"> {}

export function Label({ className, ...props }: LabelProps) {
	// biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
	return <label className={cn("text-sm font-medium", className)} {...props} />;
}
