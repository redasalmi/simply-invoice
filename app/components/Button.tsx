type ButtonProps = {
	type?: 'button' | 'submit' | 'reset';
	text: string;
	onSubmit?: React.FormEventHandler<HTMLButtonElement>;
};

export function Button({ type, text, onSubmit }: ButtonProps) {
	return (
		<button
			type={type}
			onSubmit={onSubmit}
			className="rounded-md bg-blue-400 px-4 py-2"
		>
			{text}
		</button>
	);
}
