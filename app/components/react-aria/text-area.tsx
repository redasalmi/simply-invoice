import React from 'react';
import {
	TextArea as RACTextArea,
	type TextAreaProps as RACTextAreaProps,
} from 'react-aria-components';
import { composeTailwindRenderProps } from '~/components/react-aria/utils';

export type InputRef = HTMLTextAreaElement;
export type InputProps = RACTextAreaProps;

export const TextArea = React.forwardRef<InputRef, InputProps>(
	function Input(props, ref) {
		return (
			<RACTextArea
				ref={ref}
				{...props}
				className={composeTailwindRenderProps(
					props.className,
					'min-w-0 flex-1 bg-white px-2 py-1.5 text-sm text-gray-800 outline outline-0 disabled:text-gray-200 dark:bg-zinc-900 dark:text-zinc-200 dark:disabled:text-zinc-600',
				)}
			/>
		);
	},
);
