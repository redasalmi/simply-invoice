import { Component } from 'solid-js';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import type { FormFieldProps } from '~/lib/types';

export const FormField: Component<FormFieldProps> = (props) => {
	return (
		<div class={props.class}>
			<Label for={props.id}>
				{props.label}{' '}
				{props.error ? <span class="text-red-500">({props.error})</span> : null}
			</Label>
			<Input
				type={props.type}
				id={props.id}
				name={props.name}
				required={props.required}
			/>
		</div>
	);
};
