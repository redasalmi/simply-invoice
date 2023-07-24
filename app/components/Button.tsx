import * as React from 'react';
import clsx from 'clsx';

type ButtonProps = {
	type: 'button' | 'submit' | 'reset';
	form?: string;
	className?: string;
	text: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export function Button({ type, form, className, text, onClick }: ButtonProps) {
	return (
		<button
			type={type}
			form={form}
			onClick={onClick}
			className={clsx('rounded-md bg-blue-400 px-4 py-2', className)}
		>
			{text}
		</button>
	);
}
