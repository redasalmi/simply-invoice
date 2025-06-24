import { cn } from "~/renderer/utils/cn";

export interface LabelProps extends React.ComponentPropsWithRef<"label"> {}

export function Label({ className, ...props }: LabelProps) {
	// biome-ignore lint/a11y/noLabelWithoutControl: <label doesn't always require an id>
	return <label className={cn("font-medium text-sm", className)} {...props} />;
}
