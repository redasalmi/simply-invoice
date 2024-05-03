import * as React from 'react';
import { cn } from '~/utils/shared';

type Props = React.ComponentPropsWithoutRef<'div'>;

export function Skeleton({ className, ...props }: Props) {
	return (
		<div
			className={cn('animate-pulse rounded-md bg-muted', className)}
			{...props}
		/>
	);
}
