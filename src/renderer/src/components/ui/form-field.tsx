import { createContext, use, useId } from "react";
import {
	ErrorMessage as UIErrorMessage,
	type ErrorMessageProps as UIErrorMessageProps,
} from "~/renderer/components/ui/error-message";
import {
	type InputProps,
	Input as UIInput,
} from "~/renderer/components/ui/input";
import {
	type LabelProps,
	Label as UILabel,
} from "~/renderer/components/ui/label";
import {
	type NumberInputProps,
	NumberInput as UINumberInput,
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
	const context = use(FormFieldContext);
	if (!context) {
		throw new Error("useFormField must be used within a FormField");
	}

	return context;
}

export function Label(props: Omit<LabelProps, "htmlFor">) {
	const { inputId } = useFormField();

	return <UILabel htmlFor={inputId} {...props} />;
}

export function Input(
	props: Omit<InputProps, "id" | "aria-invalid" | "aria-describedby">,
) {
	const { inputId, errorId, hasErrors } = useFormField();

	return (
		<UIInput
			aria-describedby={hasErrors ? errorId : undefined}
			aria-invalid={hasErrors}
			id={inputId}
			{...props}
		/>
	);
}

export function NumberInput(
	props: Omit<NumberInputProps, "id" | "aria-invalid" | "aria-describedby">,
) {
	const { inputId, errorId, hasErrors } = useFormField();

	return (
		<UINumberInput
			aria-describedby={hasErrors ? errorId : undefined}
			aria-invalid={hasErrors}
			id={inputId}
			{...props}
		/>
	);
}

export function ErrorMessage(props: Omit<UIErrorMessageProps, "id">) {
	const { errorId, errors } = useFormField();
	if (!errors?.length) {
		return null;
	}

	return (
		<UIErrorMessage id={errorId} {...props}>
			{errors.map((error) => (
				<span className="block" key={`${error.replace(/\s/g, "-")}-${errorId}`}>
					{error}
				</span>
			))}
		</UIErrorMessage>
	);
}

interface RootProps extends React.ComponentPropsWithRef<"div"> {
	errors?: Array<string>;
}

export function Root({ className, children, errors, ...props }: RootProps) {
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
