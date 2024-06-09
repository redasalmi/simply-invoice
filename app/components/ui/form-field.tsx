import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import type { FormFieldProps } from '~/types/formField.types';

export function FormField({
	id,
	label,
	input,
	error,
	className,
}: FormFieldProps) {
	return (
		<div className={className}>
			<Label htmlFor={id} error={error} {...label} />
			<Input id={id} hasError={!!error} {...input} />
		</div>
	);
}
