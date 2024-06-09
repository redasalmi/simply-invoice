import * as React from 'react';
import { cn } from '~/utils/shared.utils';

type Ref = HTMLLabelElement;
export type LabelProps = React.ComponentPropsWithoutRef<'label'> & {
	error?: string;
};

export const Label = React.forwardRef<Ref, LabelProps>(function Label(
	{ className, error, children, ...props },
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
			{children}{' '}
			{error ? <span className="text-red-500">({error})</span> : null}
		</label>
	);
});
