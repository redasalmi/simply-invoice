import * as React from 'react';
import * as Form from '@radix-ui/react-form';

export const formFieldErrors = {
	valueMissing: 'Please fill out this field',
	typeMismatch: 'Please provide a valid value',
	typeMismatchEmail: 'Please provide a valid email',
};

export const FormRoot = React.forwardRef<HTMLFormElement, Form.FormProps>(
	function FormRoot(props, ref) {
		return <Form.Root ref={ref} {...props} />;
	},
);

export const FormField = React.forwardRef<HTMLDivElement, Form.FormFieldProps>(
	function FormField(props, ref) {
		return <Form.FormField ref={ref} {...props} />;
	},
);

export const FormLabel = React.forwardRef<
	HTMLLabelElement,
	Form.FormLabelProps
>(function FormLabel(props, ref) {
	return <Form.FormLabel ref={ref} {...props} />;
});

export const FormControl = React.forwardRef<
	HTMLInputElement,
	Form.FormControlProps
>(function FormControl(props, ref) {
	return <Form.FormControl ref={ref} {...props} />;
});

export const FormMessage = React.forwardRef<
	HTMLSpanElement,
	Form.FormMessageProps
>(function FormMessage(props, ref) {
	return <Form.Message ref={ref} {...props} />;
});

export function FormValidityState(props: Form.FormValidityStateProps) {
	return <Form.ValidityState {...props} />;
}

export const FormSubmit = React.forwardRef<
	HTMLButtonElement,
	Form.FormSubmitProps
>(function FormSubmit(props, ref) {
	return <Form.Submit ref={ref} {...props} />;
});
