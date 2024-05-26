import { ParentComponent, JSX, splitProps, children } from 'solid-js';
import { cn } from '~/utils/shared';

export const Table: ParentComponent<JSX.HTMLAttributes<HTMLTableElement>> = (
	props,
) => {
	const [{ class: className }, { children }, otherProps] = splitProps(
		props,
		['class'],
		['children'],
	);

	return (
		<table class={cn('w-full', className)} {...otherProps}>
			{children}
		</table>
	);
};

export const TableHeader: ParentComponent<
	JSX.HTMLAttributes<HTMLTableSectionElement>
> = (props) => {
	return <thead {...props} />;
};

export const TableBody: ParentComponent<
	JSX.HTMLAttributes<HTMLTableSectionElement>
> = (props) => {
	return <tbody {...props} />;
};

export const TableFooter: ParentComponent<
	JSX.HTMLAttributes<HTMLTableSectionElement>
> = (props) => {
	return <tfoot {...props} />;
};

export const TableRow: ParentComponent<
	JSX.HTMLAttributes<HTMLTableRowElement>
> = (props) => {
	const [{ class: className }, { children }, otherProps] = splitProps(
		props,
		['class'],
		['children'],
	);

	return (
		<tr class={cn('border-b-[1px] border-gray-300', className)} {...otherProps}>
			{children}
		</tr>
	);
};

export const TableHead: ParentComponent<
	JSX.HTMLAttributes<HTMLTableSectionElement>
> = (props) => {
	const [{ class: className }, { children }, otherProps] = splitProps(
		props,
		['class'],
		['children'],
	);

	return (
		<thead class={cn('p-4 text-left text-gray-400', className)} {...otherProps}>
			{children}
		</thead>
	);
};

export const TableCell: ParentComponent<
	JSX.HTMLAttributes<HTMLTableCellElement>
> = (props) => {
	const [{ class: className }, { children }, otherProps] = splitProps(
		props,
		['class'],
		['children'],
	);

	return (
		<td class={cn('p-4', className)} {...otherProps}>
			{children}
		</td>
	);
};

export const TableCaption: ParentComponent<JSX.HTMLAttributes<HTMLElement>> = (
	props,
) => {
	return <caption {...props} />;
};
