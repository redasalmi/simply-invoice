import * as React from 'react';
import {
	FormControl,
	FormLabel,
	FormMessage,
	FormField as UIFormField,
} from '~/components/ui/form';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';

export type FormFieldProps = Pick<
	React.ComponentPropsWithoutRef<'input'>,
	| 'type'
	| 'value'
	| 'defaultValue'
	| 'onInput'
	| 'min'
	| 'max'
	| 'required'
	| 'readOnly'
	| 'autoComplete'
> & {
	id: string;
	name: string;
	label: string;
	serverError?: string;
	className?: string;
};

export function FormField({
	id,
	name,
	label,
	serverError,
	className,
	...inputProps
}: FormFieldProps) {
	const hasError = Boolean(serverError);

	return (
		<UIFormField name={name} serverInvalid={hasError} className={className}>
			<FormLabel asChild>
				<Label htmlFor={id} hasError={hasError}>
					{label}
				</Label>
			</FormLabel>

			<FormControl asChild>
				<Input id={id} hasError={hasError} {...inputProps} />
			</FormControl>

			{serverError ? (
				<FormMessage className="text-red-900">{serverError}</FormMessage>
			) : null}
		</UIFormField>
	);
}
