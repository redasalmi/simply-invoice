import { ErrorMessage } from "@renderer/components/ui/error-message";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { NumberInput } from "@renderer/components/ui/number-input";
import { cn } from "@renderer/utils/cn";
import { createContext, useContext, useId } from "react";

const FormFieldContext = createContext<{ id: string } | null>(null);

const useFormField = () => {
	const context = useContext(FormFieldContext);
	if (!context) {
		throw new Error("useFormField must be used within a FormField");
	}

	return context;
};

function FormFieldLabel(props: React.ComponentPropsWithRef<"label">) {
	const { id } = useFormField();

	return <Label htmlFor={id} {...props} />;
}

function FormFieldInput(props: React.ComponentPropsWithRef<"input">) {
	const { id } = useFormField();

	return <Input id={id} {...props} />;
}

function FormFieldNumberInput(props: React.ComponentPropsWithRef<"input">) {
	const { id } = useFormField();

	return <NumberInput id={id} {...props} />;
}

function FormFieldErrorMessage(props: React.ComponentPropsWithRef<"p">) {
	const { id } = useFormField();

	return <ErrorMessage id={id} {...props} />;
}

export function FormField({
	className,
	children,
	...props
}: React.ComponentPropsWithRef<"div">) {
	const id = useId();

	return (
		<div className={cn("flex flex-col gap-2", className)} {...props}>
			<FormFieldContext.Provider value={{ id }}>
				{children}
			</FormFieldContext.Provider>
		</div>
	);
}

FormField.Label = FormFieldLabel;
FormField.Input = FormFieldInput;
FormField.NumberInput = FormFieldNumberInput;
FormField.ErrorMessage = FormFieldErrorMessage;
