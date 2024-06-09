import * as React from 'react';
import { cn } from '~/utils/shared.utils';

type Ref = HTMLInputElement;
export type InputProps = React.ComponentPropsWithoutRef<'input'> & {
	hasError?: boolean;
};

export const Input = React.forwardRef<Ref, InputProps>(function Input(
	{ className, type = 'text', hasError, ...props },
	ref,
) {
	return (
		<input
			type={type}
			className={cn(
				'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
				className,
				hasError ? 'border border-red-500' : null,
			)}
			ref={ref}
			{...props}
		/>
	);
});
