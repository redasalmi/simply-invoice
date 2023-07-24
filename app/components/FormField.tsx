import * as React from 'react';

import { Input } from '~/components';

type FormFieldProps = {
	label: string;
	name: string;
	defaultValue?: string | number | readonly string[];
	type?: React.HTMLInputTypeAttribute;
	className?: string;
};

export function FormField({
	label,
	name,
	defaultValue,
	type,
	className,
}: FormFieldProps) {
	const id = React.useId();

	return (
		<div className={className}>
			<label htmlFor={id} className="block">
				{label}
			</label>
			<Input id={id} name={name} defaultValue={defaultValue} type={type} />
		</div>
	);
}
