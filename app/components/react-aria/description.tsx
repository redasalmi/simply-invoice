import { Text, type TextProps } from 'react-aria-components';
import { cn } from '~/utils/shared.utils';

export function Description(props: TextProps) {
	return (
		<Text
			{...props}
			slot="description"
			className={cn('text-sm text-gray-600', props.className)}
		/>
	);
}
