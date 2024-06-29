import {
	TextField as AriaTextField,
	type TextFieldProps as AriaTextFieldProps,
	type ValidationResult,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';
import { Label } from '~/components/react-aria/label';
import { Input } from '~/components/react-aria/input';
import { Description } from '~/components/react-aria/description';
import { FieldError } from '~/components/react-aria/field-error';
import {
	composeTailwindRenderProps,
	fieldBorderStyles,
	focusRing,
} from '~/components/react-aria/utils';

const inputStyles = tv({
	extend: focusRing,
	base: 'border-2 rounded-md',
	variants: {
		isFocused: fieldBorderStyles.variants.isFocusWithin,
		...fieldBorderStyles.variants,
	},
});

export type TextFieldProps = AriaTextFieldProps & {
	label?: string;
	description?: string;
	errorMessage?: string | ((validation: ValidationResult) => string);
};

export function TextField({
	label,
	description,
	errorMessage,
	...props
}: TextFieldProps) {
	return (
		<AriaTextField
			{...props}
			className={composeTailwindRenderProps(
				props.className,
				'flex flex-col gap-1',
			)}
		>
			{label ? <Label>{label}</Label> : null}
			<Input className={inputStyles} />
			{description ? <Description>{description}</Description> : null}
			<FieldError>{errorMessage}</FieldError>
		</AriaTextField>
	);
}
