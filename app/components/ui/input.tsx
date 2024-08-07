import * as React from 'react';
import { cn } from '~/utils/shared.utils';

type InputProps = React.ComponentPropsWithoutRef<'input'> & {
	hasError?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	function Input({ className, type = 'text', hasError, ...props }, ref) {
		return (
			<input
				ref={ref}
				type={type}
				className={cn(
					'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500',
					hasError &&
						'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500',
					className,
				)}
				{...props}
			/>
		);
	},
);
