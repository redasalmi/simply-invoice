import { ChevronDown, ChevronUp } from 'lucide-react';
import {
	NumberField as AriaNumberField,
	type NumberFieldProps as AriaNumberFieldProps,
	Button,
	type ButtonProps,
	type ValidationResult,
} from 'react-aria-components';
import {
	composeTailwindRenderProps,
	fieldBorderStyles,
} from '~/components/react-aria/utils';
import { Label } from '~/components/react-aria/label';
import { FieldGroup } from '~/components/react-aria/field-group';
import { Input } from '~/components/react-aria/input';
import { Description } from '~/components/react-aria/description';
import { FieldError } from '~/components/react-aria/field-error';

function StepperButton(props: ButtonProps) {
	return (
		<Button
			{...props}
			className="cursor-default px-0.5 text-gray-500 pressed:bg-gray-100 group-disabled:text-gray-200 dark:text-zinc-400 dark:pressed:bg-zinc-800 dark:group-disabled:text-zinc-600 forced-colors:group-disabled:text-[GrayText]"
		/>
	);
}

export type NumberFieldProps = AriaNumberFieldProps & {
	label?: string;
	description?: string;
	errorMessage?: string | ((validation: ValidationResult) => string);
};

export function NumberField({
	label,
	description,
	errorMessage,
	...props
}: NumberFieldProps) {
	return (
		<AriaNumberField
			{...props}
			className={composeTailwindRenderProps(
				props.className,
				'group flex flex-col gap-1',
			)}
		>
			<Label>{label}</Label>
			<FieldGroup>
				{(renderProps) => (
					<>
						<Input />
						<div
							className={fieldBorderStyles({
								...renderProps,
								class: 'flex flex-col border-s-2',
							})}
						>
							<StepperButton slot="increment">
								<ChevronUp aria-hidden className="h-4 w-4" />
							</StepperButton>
							<div
								className={fieldBorderStyles({
									...renderProps,
									class: 'border-b-2',
								})}
							/>
							<StepperButton slot="decrement">
								<ChevronDown aria-hidden className="h-4 w-4" />
							</StepperButton>
						</div>
					</>
				)}
			</FieldGroup>
			{description && <Description>{description}</Description>}
			<FieldError>{errorMessage}</FieldError>
		</AriaNumberField>
	);
}
