import type * as React from "react";
import { cn } from "~/renderer/utils/cn";

function TableHeader({
	className,
	...props
}: React.ComponentPropsWithRef<"thead">) {
	return <thead className={className} {...props} />;
}

function TableBody({
	className,
	...props
}: React.ComponentPropsWithRef<"tbody">) {
	return <tbody className={className} {...props} />;
}

function TableFooter({
	className,
	...props
}: React.ComponentPropsWithRef<"tfoot">) {
	return <tfoot className={className} {...props} />;
}

function TableRow({ className, ...props }: React.ComponentPropsWithRef<"tr">) {
	return (
		<tr
			className={cn("border-gray-300 border-b-[1px]", className)}
			{...props}
		/>
	);
}

function TableHead({ className, ...props }: React.ComponentPropsWithRef<"th">) {
	return (
		<th className={cn("p-4 text-left text-gray-400", className)} {...props} />
	);
}

function TableCell({ className, ...props }: React.ComponentPropsWithRef<"td">) {
	return <td className={cn("p-4", className)} {...props} />;
}

function TableCaption({
	className,
	...props
}: React.ComponentPropsWithRef<"caption">) {
	return <caption className={className} {...props} />;
}

export function Table({
	className,
	...props
}: React.ComponentPropsWithRef<"table">) {
	return <table className={cn("w-full", className)} {...props} />;
}

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Footer = TableFooter;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;
Table.Caption = TableCaption;
