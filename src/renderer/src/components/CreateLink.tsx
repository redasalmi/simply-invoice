import { Link, type LinkProps } from "react-router";
import { cn } from "~/renderer/utils/cn";

export function CreateLink({ className, ...props }: LinkProps) {
	return (
		<Link
			className={cn(
				"rounded-lg bg-blue-700 px-5 py-2.5 font-medium text-sm text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300",
				className,
			)}
			{...props}
		/>
	);
}
