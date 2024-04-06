import * as React from 'react';

type Ref = HTMLLabelElement;
type Props = React.ComponentPropsWithoutRef<'label'> & {
	children: React.ReactNode;
};

const Label = React.forwardRef<Ref, Props>(function Label(
	{ children, ...props },
	ref,
) {
	return (
		<label
			ref={ref}
			className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			{...props}
		>
			{children}
		</label>
	);
});

export { Label };
