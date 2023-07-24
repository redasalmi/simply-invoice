type InputProps = {
	id: string;
	name: string;
	type?: React.HTMLInputTypeAttribute;
};

export function Input({ id, name, type = 'text' }: InputProps) {
	return (
		<input
			id={id}
			name={name}
			type={type}
			className="rounded-md border border-gray-500 px-2 py-1"
		/>
	);
}
