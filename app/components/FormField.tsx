import { Input } from '~/components';

type FormFieldProps = {
	label: string;
	id: string;
	name: string;
	type?: React.HTMLInputTypeAttribute;
	className?: string;
};

export function FormField({
	label,
	id,
	name,
	type,
	className,
}: FormFieldProps) {
	return (
		<div className={className}>
			<label htmlFor={id} className="block">
				{label}
			</label>
			<Input id={id} name={name} type={type} />
		</div>
	);
}
