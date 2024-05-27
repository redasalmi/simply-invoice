import { splitProps, type JSX, type ParentComponent } from 'solid-js';
import { cn } from '~/utils/shared';

export const Label: ParentComponent<
	JSX.LabelHTMLAttributes<HTMLLabelElement>
> = (props) => {
	const [local, otherProps] = splitProps(props, ['class', 'children']);

	return (
		<label
			class={cn(
				'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
				local.class,
			)}
			{...otherProps}
		>
			{local.children}
		</label>
	);
};
