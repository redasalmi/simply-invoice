import { For } from 'solid-js';

import InputField from './InputField';

import type { Field } from '~/routes';

type FieldListProps = {
	fields: Field[];
};

export default function FieldList(props: FieldListProps) {
	return (
		<For each={props.fields}>
			{(data) => {
				return <InputField id={data.key} label={data.key} value={data.value} />;
			}}
		</For>
	);
}
