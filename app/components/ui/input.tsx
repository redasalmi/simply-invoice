import * as React from 'react';
import {
	Input as RACInput,
	type InputProps as RACInputProps,
} from 'react-aria-components';
import { cva, type VariantProps } from 'cva';

const input = cva({
	base: 'border-2 rounded-md px-2 py-1.5 flex-1 min-w-0 outline outline-0 bg-white dark:bg-zinc-900 text-sm text-gray-800 dark:text-zinc-200 disabled:text-gray-200 dark:disabled:text-zinc-600',
	variants: {
		isFocused: {
			false:
				'border-gray-300 dark:border-zinc-500 forced-colors:border-[ButtonBorder]',
			true: 'border-gray-600 dark:border-zinc-300 forced-colors:border-[Highlight]',
		},
		isFocusWithin: {
			false:
				'border-gray-300 dark:border-zinc-500 forced-colors:border-[ButtonBorder]',
			true: 'border-gray-600 dark:border-zinc-300 forced-colors:border-[Highlight]',
		},
		isInvalid: {
			true: 'border-red-600 dark:border-red-600 forced-colors:border-[Mark]',
		},
		isDisabled: {
			true: 'border-gray-200 dark:border-zinc-700 forced-colors:border-[GrayText]',
		},
	},
});

export type InputRef = HTMLInputElement;
export type InputProps = RACInputProps & VariantProps<typeof input>;

export const Input = React.forwardRef<InputRef, InputProps>(function Input(
	{ isFocused, isFocusWithin, isInvalid, isDisabled, className, ...props },
	ref,
) {
	return (
		<RACInput
			ref={ref}
			className={input({
				isFocused,
				isFocusWithin,
				isInvalid,
				isDisabled,
				className,
			})}
			{...props}
		/>
	);
});
