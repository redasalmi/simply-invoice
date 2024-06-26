import * as React from 'react';
import {
	Label as RACLabel,
	type LabelProps as RACLabelProps,
} from 'react-aria-components';
import { cva, type VariantProps } from 'cva';

const label = cva({
	base: 'text-sm text-gray-500 dark:text-zinc-400 font-medium cursor-default w-fit',
});

export type LabelRef = HTMLLabelElement;
export type LabelProps = RACLabelProps & VariantProps<typeof label>;

export const Label = React.forwardRef<LabelRef, LabelProps>(function Label(
	{ className, children, ...props },
	ref,
) {
	return (
		<RACLabel ref={ref} className={label({ className })} {...props}>
			{children}
		</RACLabel>
	);
});
