import {
	TextField as AriaTextField,
	type TextFieldProps as AriaTextFieldProps,
	type ValidationResult,
} from 'react-aria-components';
import { Label } from './label';
import { Input } from './input';
import { Description } from './description';
import { FieldError } from './field-error';
import { cn } from '~/utils/shared.utils';

export type TextFieldProps = AriaTextFieldProps & {
	label: string;
	description?: string;
	errorMessage?: string | ((validation: ValidationResult) => string);
};

export function TextField({
	label,
	description,
	errorMessage,
	className,
	...props
}: TextFieldProps) {
	return (
		<AriaTextField className={cn(className, 'flex flex-col gap-1')} {...props}>
			<Label>{label}</Label>
			<Input className="invalid:border-red-600 invalid:dark:border-red-600 invalid:forced-colors:border-[Mark]" />
			{description ? <Description>{description}</Description> : null}
			<FieldError>{errorMessage}</FieldError>
		</AriaTextField>
	);
}
