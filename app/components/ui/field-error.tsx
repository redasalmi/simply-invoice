import {
	FieldError as RACFieldError,
	type FieldErrorProps,
} from 'react-aria-components';
import { cn } from '~/utils/shared.utils';

export function FieldError({ className, ...props }: FieldErrorProps) {
	return (
		<RACFieldError
			className={cn(
				className,
				'text-sm text-red-600 forced-colors:text-[Mark]',
			)}
			{...props}
		/>
	);
}
