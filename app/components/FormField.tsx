import * as React from 'react';
import {
	FormControl,
	formFieldErrors,
	FormLabel,
	FormMessage,
	FormValidityState,
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
	return (
		<UIFormField
			name={name}
			serverInvalid={Boolean(serverError)}
			className={className}
		>
			<FormValidityState>
				{(validity) => (
					<>
						<FormLabel asChild>
							<Label htmlFor={id} hasError={validity && !validity.valid}>
								{label}
							</Label>
						</FormLabel>

						<FormControl asChild>
							<Input
								id={id}
								hasError={validity && !validity.valid}
								{...inputProps}
							/>
						</FormControl>
					</>
				)}
			</FormValidityState>

			<FormMessage className="text-red-900" match="valueMissing">
				{formFieldErrors.valueMissing}
			</FormMessage>

			<FormMessage className="text-red-900" match="typeMismatch">
				{inputProps.type === 'email'
					? formFieldErrors.typeMismatchEmail
					: formFieldErrors.typeMismatch}
			</FormMessage>

			{serverError ? (
				<FormMessage className="text-red-900">{serverError}</FormMessage>
			) : null}
		</UIFormField>
	);
}
