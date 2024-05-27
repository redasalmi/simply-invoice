import { type JSX, type ParentComponent, splitProps } from 'solid-js';
import { cn } from '~/utils/shared';

export const Button: ParentComponent<
	JSX.ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => {
	const [local, otherProps] = splitProps(props, ['class', 'children']);

	return (
		<button
			class={cn(
				'bg-primary text-primary-foreground ring-offset-background hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
				local.class,
			)}
			{...otherProps}
		>
			{local.children}
		</button>
	);
};
