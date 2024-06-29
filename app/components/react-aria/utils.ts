import { composeRenderProps } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

export const focusRing = tv({
	base: 'outline outline-blue-600 dark:outline-blue-500 forced-colors:outline-[Highlight] outline-offset-2',
	variants: {
		isFocusVisible: {
			false: 'outline-0',
			true: 'outline-2',
		},
	},
});

export const fieldBorderStyles = tv({
	variants: {
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

export const fieldGroupStyles = tv({
	extend: focusRing,
	base: 'group flex items-center h-9 bg-white dark:bg-zinc-900 forced-colors:bg-[Field] border-2 rounded-lg overflow-hidden',
	variants: fieldBorderStyles.variants,
});

export function composeTailwindRenderProps<T>(
	className: string | ((v: T) => string) | undefined,
	tw: string,
): string | ((v: T) => string) {
	return composeRenderProps(className, (className) => twMerge(tw, className));
}
