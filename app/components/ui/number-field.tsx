import { NumberField } from '@base-ui-components/react';
import { PlusIcon, MinusIcon } from 'lucide-react';
import { cn } from '~/utils/shared.utils';
import type { ComponentPropsWithRef } from 'react';

export function NumberFieldRoot(props: NumberField.Root.Props) {
	return <NumberField.Root format={{ useGrouping: false }} {...props} />;
}

export function NumberFieldScrubArea(props: NumberField.ScrubArea.Props) {
	return <NumberField.ScrubArea {...props} />;
}

export function NumberFieldLabel({
	className,
	...props
}: ComponentPropsWithRef<'label'>) {
	return (
		// eslint-disable-next-line jsx-a11y/label-has-associated-control
		<label
			className={cn('mb-1 block text-sm font-medium text-gray-900', className)}
			{...props}
		/>
	);
}

export function NumberFieldScrubAreaCursor(
	props: NumberField.ScrubAreaCursor.Props,
) {
	return <NumberField.ScrubAreaCursor {...props} />;
}

export function NumberFieldGroup({
	className,
	...props
}: NumberField.Group.Props) {
	return <NumberField.Group className={cn('flex', className)} {...props} />;
}

export function NumberFieldDecrement({
	className,
	...props
}: NumberField.Decrement.Props) {
	return (
		<NumberField.Decrement
			className={cn(
				'size-[42px] rounded-l-lg border border-gray-300 bg-gray-50',
				className,
			)}
			{...props}
		>
			<MinusIcon className="m-auto text-gray-900" />
		</NumberField.Decrement>
	);
}

export function NumberFieldInput({
	className,
	...props
}: NumberField.Input.Props) {
	return (
		<NumberField.Input
			className={cn(
				'border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500',
				'aria-[invalid]:border-red-500 aria-[invalid]:bg-red-50 aria-[invalid]:text-red-900 aria-[invalid]:placeholder-red-700 aria-[invalid]:focus:border-red-500 aria-[invalid]:focus:ring-red-500',
				className,
			)}
			{...props}
		/>
	);
}

export function NumberFieldIncrement({
	className,
	...props
}: NumberField.Increment.Props) {
	return (
		<NumberField.Increment
			className={cn(
				'size-[42px] rounded-r-lg border border-gray-300 bg-gray-50',
				className,
			)}
			{...props}
		>
			<PlusIcon className="m-auto text-gray-900" />
		</NumberField.Increment>
	);
}
