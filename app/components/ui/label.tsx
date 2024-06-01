import * as React from 'react';
import { cn } from '~/utils/shared.utils';

type Ref = HTMLLabelElement;
type Props = React.ComponentPropsWithoutRef<'label'>;

export const Label = React.forwardRef<Ref, Props>(function Label(
	{ className, children, ...props },
	ref,
) {
	return (
		<label
			ref={ref}
			className={cn(
				'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
				className,
			)}
			{...props}
		>
			{children}
		</label>
	);
});
