import { createContext, useContext, useId } from "react";
import {
	ErrorMessage,
	type ErrorMessageProps,
} from "~/renderer/components/ui/error-message";
import { Input, type InputProps } from "~/renderer/components/ui/input";
import { Label, type LabelProps } from "~/renderer/components/ui/label";
import {
	NumberInput,
	type NumberInputProps,
} from "~/renderer/components/ui/number-input";
import { cn } from "~/renderer/utils/cn";

interface FormFieldContextInterface {
	inputId: string;
	errorId: string;
	errors?: Array<string>;
	hasErrors: boolean;
}

const FormFieldContext = createContext<FormFieldContextInterface | null>(null);

function useFormField() {
	const context = useContext(FormFieldContext);
	if (!context) {
		throw new Error("useFormField must be used within a FormField");
	}

	return context;
}

function FormFieldLabel(props: Omit<LabelProps, "htmlFor">) {
	const { inputId } = useFormField();

	return <Label htmlFor={inputId} {...props} />;
}

function FormFieldInput(
	props: Omit<InputProps, "id" | "aria-invalid" | "aria-describedby">,
) {
	const { inputId, errorId, hasErrors } = useFormField();

	return (
		<Input
			id={inputId}
			aria-invalid={hasErrors}
			aria-describedby={hasErrors ? errorId : undefined}
			{...props}
		/>
	);
}

function FormFieldNumberInput(
	props: Omit<NumberInputProps, "id" | "aria-invalid" | "aria-describedby">,
) {
	const { inputId, errorId, hasErrors } = useFormField();

	return (
		<NumberInput
			id={inputId}
			aria-invalid={hasErrors}
			aria-describedby={hasErrors ? errorId : undefined}
			{...props}
		/>
	);
}

function FormFieldErrorMessage(props: Omit<ErrorMessageProps, "id">) {
	const { errorId, errors } = useFormField();
	if (!errors?.length) {
		return null;
	}

	return (
		<ErrorMessage id={errorId} {...props}>
			{errors.map((error) => (
				<span className="block" key={`${error.replace(/\s/g, "-")}-${errorId}`}>
					{error}
				</span>
			))}
		</ErrorMessage>
	);
}

interface FormFieldProps extends React.ComponentPropsWithRef<"div"> {
	errors?: Array<string>;
}

export function FormField({
	className,
	children,
	errors,
	...props
}: FormFieldProps) {
	const inputId = useId();
	const errorId = useId();
	const hasErrors = Boolean(errors?.length);

	return (
		<div className={cn("flex flex-col gap-2", className)} {...props}>
			<FormFieldContext.Provider
				value={{ inputId, errorId, errors, hasErrors }}
			>
				{children}
			</FormFieldContext.Provider>
		</div>
	);
}

FormField.Label = FormFieldLabel;
FormField.Input = FormFieldInput;
FormField.NumberInput = FormFieldNumberInput;
FormField.ErrorMessage = FormFieldErrorMessage;
