import type { JSX } from 'solid-js';

type InputFieldProps = {
	id: string;
	label: string;
	type?: string;
	value?: string;
	handleOnInput?: (value: string) => void;
};

export default function InputField(props: InputFieldProps) {
	const id = () => props.id.trim().replaceAll(' ', '-');

	const handleInputChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (
		event,
	) => {
		if (props.handleOnInput) {
			props.handleOnInput(event.currentTarget.value);
		}
	};

	return (
		<div class="my-6">
			<label for={id()}>{props.label}</label>
			<input
				id={id()}
				name={id()}
				type={props.type || 'text'}
				value={props.value || ''}
				onInput={handleInputChange}
				class="block rounded-md border-2 border-gray-500 px-4 py-2"
			/>
		</div>
	);
}
