import * as React from 'react';

import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';

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
			<Label htmlFor={id} className="mb-1 block">
				{label}
			</Label>
			<Input
				id={id}
				type={type}
				name={name.replaceAll(' ', '-')}
				defaultValue={defaultValue}
			/>
		</div>
	);
}
