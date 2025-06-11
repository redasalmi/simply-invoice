import type * as React from "react";
import { cn } from "../../utils/cn";

export function Skeleton({
	className,
	...props
}: React.ComponentPropsWithRef<"div">) {
	return (
		<div className={cn("animate-pulse rounded-md", className)} {...props} />
	);
}
