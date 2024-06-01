import * as React from 'react';
import { cn } from '~/utils/shared.utils';

export const Table = React.forwardRef<
	HTMLTableElement,
	React.ComponentPropsWithoutRef<'table'>
>(function table({ className, children, ...props }, ref) {
	return (
		<table ref={ref} className={cn('w-full', className)} {...props}>
			{children}
		</table>
	);
});

export const TableHeader = React.forwardRef<
	HTMLTableSectionElement,
	React.ComponentPropsWithoutRef<'thead'>
>(function TableHeader({ className, children, ...props }, ref) {
	return (
		<thead ref={ref} className={className} {...props}>
			{children}
		</thead>
	);
});

export const TableBody = React.forwardRef<
	HTMLTableSectionElement,
	React.ComponentPropsWithoutRef<'tbody'>
>(function TableBody({ className, children, ...props }, ref) {
	return (
		<tbody ref={ref} className={className} {...props}>
			{children}
		</tbody>
	);
});

export const TableFooter = React.forwardRef<
	HTMLTableSectionElement,
	React.ComponentPropsWithoutRef<'tfoot'>
>(function TableFooter({ className, children, ...props }, ref) {
	return (
		<tfoot ref={ref} className={className} {...props}>
			{children}
		</tfoot>
	);
});

export const TableRow = React.forwardRef<
	HTMLTableRowElement,
	React.ComponentPropsWithoutRef<'tr'>
>(function tableRow({ className, children, ...props }, ref) {
	return (
		<tr
			ref={ref}
			className={cn('border-b-[1px] border-gray-300', className)}
			{...props}
		>
			{children}
		</tr>
	);
});

export const TableHead = React.forwardRef<
	HTMLTableCellElement,
	React.ComponentPropsWithoutRef<'th'>
>(function TableHead({ className, children, ...props }, ref) {
	return (
		<th
			ref={ref}
			className={cn('p-4 text-left text-gray-400', className)}
			{...props}
		>
			{children}
		</th>
	);
});

export const TableCell = React.forwardRef<
	HTMLTableCellElement,
	React.ComponentPropsWithoutRef<'td'>
>(function TableCell({ className, children, ...props }, ref) {
	return (
		<td ref={ref} className={cn('p-4', className)} {...props}>
			{children}
		</td>
	);
});

export const TableCaption = React.forwardRef<
	HTMLTableCaptionElement,
	React.ComponentPropsWithoutRef<'caption'>
>(function TableCaption({ className, children, ...props }, ref) {
	return (
		<caption ref={ref} className={className} {...props}>
			{children}
		</caption>
	);
});
