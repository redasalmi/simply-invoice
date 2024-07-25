import * as React from 'react';
import { cn } from '~/utils/shared.utils';

export const Button = React.forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<'button'>
>(function Button({ className, type = 'button', ...props }, ref) {
	return (
		<button
			ref={ref}
			type={type}
			className={cn(
				'rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300',
				className,
			)}
			{...props}
		/>
	);
});
