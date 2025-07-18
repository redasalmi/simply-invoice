import type * as React from "react";
import { cn } from "~/renderer/utils/cn";

export function Header({
	className,
	...props
}: React.ComponentPropsWithRef<"thead">) {
	return <thead className={className} {...props} />;
}

export function Body({
	className,
	...props
}: React.ComponentPropsWithRef<"tbody">) {
	return <tbody className={className} {...props} />;
}

export function Footer({
	className,
	...props
}: React.ComponentPropsWithRef<"tfoot">) {
	return <tfoot className={className} {...props} />;
}

export function Row({
	className,
	...props
}: React.ComponentPropsWithRef<"tr">) {
	return (
		<tr
			className={cn("border-gray-300 border-b-[1px]", className)}
			{...props}
		/>
	);
}

export function Head({
	className,
	...props
}: React.ComponentPropsWithRef<"th">) {
	return (
		<th className={cn("p-4 text-left text-gray-400", className)} {...props} />
	);
}

export function Cell({
	className,
	...props
}: React.ComponentPropsWithRef<"td">) {
	return <td className={cn("p-4", className)} {...props} />;
}

export function Caption({
	className,
	...props
}: React.ComponentPropsWithRef<"caption">) {
	return <caption className={className} {...props} />;
}

export function Root({
	className,
	...props
}: React.ComponentPropsWithRef<"table">) {
	return <table className={cn("w-full", className)} {...props} />;
}
