import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { cn } from '~/utils/shared.utils';
import type { FormFieldProps } from '~/types/formField.types';
import { useId } from 'react';

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

type FieldProps = {
	error?: string;
	className?: string;
	label: React.ComponentPropsWithoutRef<'label'>;
	input: Omit<React.ComponentPropsWithoutRef<'input'>, 'id'>;
};

export function Field({
	error,
	className,
	label: { className: labelClassName, children: labelChildren, ...labelProps },
	input: { className: inputClassName, ...inputProps },
}: FieldProps) {
	const id = useId();

	return (
		<div className={className}>
			<Label
				htmlFor={id}
				className={cn(
					'mb-1 block',
					labelClassName,
					error ? 'text-red-500' : null,
				)}
				{...labelProps}
			>
				{labelChildren}{' '}
				{error ? <span className="text-red-500">({error})</span> : null}
			</Label>
			<Input
				id={id}
				className={cn(inputClassName, error ? 'border border-red-500' : null)}
				{...inputProps}
			/>
		</div>
	);
}
