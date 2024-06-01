import * as React from 'react';
import { cn } from '~/utils/shared.utils';

type Ref = HTMLButtonElement;
type Props = React.ComponentPropsWithoutRef<'button'>;

export const Button = React.forwardRef<Ref, Props>(function Button(
	{ className, type = 'button', children, ...props },
	ref,
) {
	return (
		<button
			ref={ref}
			type={type}
			className={cn(
				'inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
});
