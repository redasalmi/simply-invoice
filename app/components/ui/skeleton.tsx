import * as React from 'react';
import { cn } from '~/utils/shared.utils';

type Props = React.ComponentPropsWithoutRef<'div'>;

export function Skeleton({ className, children, ...props }: Props) {
	return (
		<div
			className={cn('animate-pulse rounded-md bg-muted', className)}
			{...props}
		>
			{children}
		</div>
	);
}
