import { Link, type LinkProps } from 'react-router';
import { cn } from '~/utils/shared.utils';

export function CreateLink({ className, ...props }: LinkProps) {
	return (
		<Link
			className={cn(
				'rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none',
				className,
			)}
			{...props}
		/>
	);
}
