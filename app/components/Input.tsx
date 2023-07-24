type InputProps = {
	id: string;
	name: string;
	defaultValue?: string | number | readonly string[];
	type?: React.HTMLInputTypeAttribute;
};

export function Input({ id, name, defaultValue, type = 'text' }: InputProps) {
	return (
		<input
			id={id}
			name={name}
			type={type}
			defaultValue={defaultValue}
			className="rounded-md border border-gray-500 px-2 py-1"
		/>
	);
}
