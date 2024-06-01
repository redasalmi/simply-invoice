import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { cn } from '~/utils/shared.utils';
import type { FormFieldProps } from '~/types/formField.types';

export function FormField({
	id,
	name,
	label,
	defaultValue,
	className,
	required,
	error,
	type,
}: FormFieldProps) {
	return (
		<div className={className}>
			<Label
				htmlFor={id}
				className={cn('mb-1 block', error ? 'text-red-500' : null)}
			>
				{label} {error ? <span className="text-red-500">({error})</span> : null}
			</Label>
			<div>
				<Input
					type={type}
					id={id}
					name={name}
					defaultValue={defaultValue}
					required={required}
					className={cn(error ? 'border border-red-500' : null)}
				/>
			</div>
		</div>
	);
}
