import { JSX } from 'solid-js';

type ButtonProps = {
	text: string;
	type?: 'button' | 'submit' | 'reset';
	disabled?: boolean;
	onClick?: () => void;
};

export default function Button(props: ButtonProps) {
	const handleOnClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (
		event,
	) => {
		if (props.onClick) {
			event.preventDefault();
			props.onClick();
		}
	};

	return (
		<button
			class="my-6 rounded-md bg-blue-400 px-6 py-2"
			type={props.type || 'button'}
			disabled={props.disabled}
			onClick={handleOnClick}
		>
			{props.text}
		</button>
	);
}
