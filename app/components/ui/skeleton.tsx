/* eslint-disable @typescript-eslint/no-empty-object-type */
import * as React from 'react';
import { cn } from '~/utils/shared.utils';

interface Props extends React.ComponentPropsWithoutRef<'div'> {}

export function Skeleton({ className, ...props }: Props) {
	return (
		<div className={cn('animate-pulse rounded-md', className)} {...props} />
	);
}
