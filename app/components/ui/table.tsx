/* eslint-disable @typescript-eslint/no-empty-object-type */
import * as React from 'react';
import { cn } from '~/utils/shared.utils';

interface TableProps extends React.ComponentPropsWithoutRef<'table'> {}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
	function table({ className, children, ...props }, ref) {
		return (
			<table ref={ref} className={cn('w-full', className)} {...props}>
				{children}
			</table>
		);
	},
);

interface TableHeaderProps extends React.ComponentPropsWithoutRef<'thead'> {}

export const TableHeader = React.forwardRef<
	HTMLTableSectionElement,
	TableHeaderProps
>(function TableHeader({ className, children, ...props }, ref) {
	return (
		<thead ref={ref} className={className} {...props}>
			{children}
		</thead>
	);
});

interface TableBodyProps extends React.ComponentPropsWithoutRef<'tbody'> {}

export const TableBody = React.forwardRef<
	HTMLTableSectionElement,
	TableBodyProps
>(function TableBody({ className, children, ...props }, ref) {
	return (
		<tbody ref={ref} className={className} {...props}>
			{children}
		</tbody>
	);
});

interface TableFooterProps extends React.ComponentPropsWithoutRef<'tfoot'> {}

export const TableFooter = React.forwardRef<
	HTMLTableSectionElement,
	TableFooterProps
>(function TableFooter({ className, children, ...props }, ref) {
	return (
		<tfoot ref={ref} className={className} {...props}>
			{children}
		</tfoot>
	);
});

interface TableRowProps extends React.ComponentPropsWithoutRef<'tr'> {}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
	function tableRow({ className, children, ...props }, ref) {
		return (
			<tr
				ref={ref}
				className={cn('border-b-[1px] border-gray-300', className)}
				{...props}
			>
				{children}
			</tr>
		);
	},
);

interface TableHeadProps extends React.ComponentPropsWithoutRef<'th'> {}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
	function TableHead({ className, children, ...props }, ref) {
		return (
			<th
				ref={ref}
				className={cn('p-4 text-left text-gray-400', className)}
				{...props}
			>
				{children}
			</th>
		);
	},
);

interface TableCellProps extends React.ComponentPropsWithoutRef<'td'> {}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
	function TableCell({ className, children, ...props }, ref) {
		return (
			<td ref={ref} className={cn('p-4', className)} {...props}>
				{children}
			</td>
		);
	},
);

interface TableCaptionProps extends React.ComponentPropsWithoutRef<'caption'> {}

export const TableCaption = React.forwardRef<
	HTMLTableCaptionElement,
	TableCaptionProps
>(function TableCaption({ className, children, ...props }, ref) {
	return (
		<caption ref={ref} className={className} {...props}>
			{children}
		</caption>
	);
});
