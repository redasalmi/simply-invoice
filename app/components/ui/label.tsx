import * as React from 'react';
import { cn } from '~/utils/shared.utils';

type LabelProps = React.ComponentPropsWithoutRef<'label'> & {
	hasError?: boolean;
};

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
	function Label({ className, hasError, ...props }, ref) {
		return (
			<label
				ref={ref}
				className={cn(
					'mb-1 block text-sm font-medium text-gray-900 dark:text-white',
					hasError && 'text-red-900',
					className,
				)}
				{...props}
			/>
		);
	},
);
