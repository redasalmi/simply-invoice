import * as React from 'react';
import { cn } from '~/utils/shared.utils';

const variants = {
	default:
		'cursor-pointer rounded-lg bg-blue-700 py-2.5 px-5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none',
	alternative:
		'rounded-lg border border-gray-200 bg-white py-2.5 px-5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 focus:outline-none',
	danger:
		'rounded-lg bg-red-700 py-2.5 px-5 text-sm font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 focus:outline-none',
	icon: 'inline-flex items-center rounded-full border border-blue-700 p-2 text-center text-sm font-medium text-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:ring-blue-300 focus:outline-none',
};

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
	variant?: keyof typeof variants;
}

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
