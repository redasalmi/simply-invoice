import { Text, type TextProps } from 'react-aria-components';
import { cn } from '~/utils/shared.utils';

export function Description({ className, ...props }: TextProps) {
	return (
		<Text
			{...props}
			slot="description"
			className={cn('text-sm text-gray-600', className)}
		/>
	);
}
