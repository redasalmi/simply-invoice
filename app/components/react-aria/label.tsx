import { type LabelProps, Label as RACLabel } from 'react-aria-components';
import { cn } from '~/utils/shared.utils';

export function Label(props: LabelProps) {
	return (
		<RACLabel
			{...props}
			className={cn(
				'w-fit cursor-default text-sm font-medium text-gray-500 dark:text-zinc-400',
				props.className,
			)}
		/>
	);
}
