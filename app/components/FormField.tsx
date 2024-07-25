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

export type FormFieldProps = {
	id: string;
	name: string;
	label: string;
	type?: React.HTMLInputTypeAttribute;
	defaultValue?: React.HTMLAttributes<HTMLInputElement>['defaultValue'];
	required?: boolean;
	serverError?: string;
	className?: string;
};

export function FormField({
	id,
	name,
	label,
	type,
	defaultValue,
	required,
	serverError,
	className,
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
						<FormLabel htmlFor={id} asChild>
							<Label hasError={validity && !validity.valid}>{label}</Label>
						</FormLabel>

						<FormControl
							id={id}
							type={type}
							defaultValue={defaultValue}
							required={required}
							asChild
						>
							<Input hasError={validity && !validity.valid} />
						</FormControl>
					</>
				)}
			</FormValidityState>

			<FormMessage className="text-red-900" match="valueMissing">
				{formFieldErrors.valueMissing}
			</FormMessage>

			<FormMessage className="text-red-900" match="typeMismatch">
				{type === 'email'
					? formFieldErrors.typeMismatchEmail
					: formFieldErrors.typeMismatch}
			</FormMessage>

			{serverError ? (
				<FormMessage className="text-red-900">{serverError}</FormMessage>
			) : null}
		</UIFormField>
	);
}
