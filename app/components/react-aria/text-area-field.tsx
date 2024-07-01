import {
	TextField,
	type TextFieldProps,
	type ValidationResult,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';
import { Label } from '~/components/react-aria/label';
import { TextArea } from '~/components/react-aria/text-area';
import { Description } from '~/components/react-aria/description';
import { FieldError } from '~/components/react-aria/field-error';
import {
	composeTailwindRenderProps,
	fieldBorderStyles,
	focusRing,
} from '~/components/react-aria/utils';

const textAreaStyles = tv({
	extend: focusRing,
	base: 'border-2 rounded-md',
	variants: {
		isFocused: fieldBorderStyles.variants.isFocusWithin,
		...fieldBorderStyles.variants,
	},
});

export type TextAriaFieldProps = TextFieldProps & {
	label?: string;
	description?: string;
	errorMessage?: string | ((validation: ValidationResult) => string);
};

export function TextAreaField({
	label,
	description,
	errorMessage,
	...props
}: TextAriaFieldProps) {
	return (
		<TextField
			{...props}
			className={composeTailwindRenderProps(
				props.className,
				'flex flex-col gap-1',
			)}
		>
			{label ? <Label>{label}</Label> : null}
			<TextArea className={textAreaStyles} />
			{description ? <Description>{description}</Description> : null}
			<FieldError>{errorMessage}</FieldError>
		</TextField>
	);
}
