import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import type { FormFieldProps } from '~/types/formField.types';

export function FormField({ id, label, input, className }: FormFieldProps) {
	return (
		<div className={className}>
			<Label htmlFor={id} {...label} />
			<Input id={id} {...input} />
		</div>
	);
}
