import * as React from 'react';
import { cn } from '~/utils/shared.utils';

const variants = {
	default:
		'rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300',
	alternative:
		'py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100',
	danger:
		'focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5',
	icon: 'text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2 text-center inline-flex items-center',
};

type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
	variant?: keyof typeof variants;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	function Button(
		{ className, type = 'button', variant = 'default', ...props },
		ref,
	) {
		return (
			<button
				ref={ref}
				type={type}
				className={cn(variants[variant], className)}
				{...props}
			/>
		);
	},
);
