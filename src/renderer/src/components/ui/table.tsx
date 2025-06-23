import type * as React from "react";
import { cn } from "~/renderer/utils/cn";

export function Table({
	className,
	...props
}: React.ComponentPropsWithRef<"table">) {
	return <table className={cn("w-full", className)} {...props} />;
}

export function TableHeader({
	className,
	...props
}: React.ComponentPropsWithRef<"thead">) {
	return <thead className={className} {...props} />;
}

export function TableBody({
	className,
	...props
}: React.ComponentPropsWithRef<"tbody">) {
	return <tbody className={className} {...props} />;
}

export function TableFooter({
	className,
	...props
}: React.ComponentPropsWithRef<"tfoot">) {
	return <tfoot className={className} {...props} />;
}

export function TableRow({
	className,
	...props
}: React.ComponentPropsWithRef<"tr">) {
	return (
		<tr
			className={cn("border-b-[1px] border-gray-300", className)}
			{...props}
		/>
	);
}

export function TableHead({
	className,
	...props
}: React.ComponentPropsWithRef<"th">) {
	return (
		<th className={cn("p-4 text-left text-gray-400", className)} {...props} />
	);
}

export function TableCell({
	className,
	...props
}: React.ComponentPropsWithRef<"td">) {
	return <td className={cn("p-4", className)} {...props} />;
}

export function TableCaption({
	className,
	...props
}: React.ComponentPropsWithRef<"caption">) {
	return <caption className={className} {...props} />;
}
