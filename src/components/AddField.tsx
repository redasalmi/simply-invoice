import { Show, createSignal } from 'solid-js';

import InputField from './InputField';
import Button from './Button';

import type { Setter } from 'solid-js';

export type Field = { key: string; value: string };
type ButtonProps = {
	fieldPrefix: string;
	setFields: Setter<Field[]>;
};
type FieldParam = {
	[key: string]: string;
};

const initField: Field = { key: '', value: '' };

export default function AddField(props: ButtonProps) {
	const [field, setField] = createSignal<Field>(initField);
	const [showField, setShowField] = createSignal(false);

	const onInput = (newField: FieldParam) => {
		setField({
			...field(),
			...newField,
		});
	};

	const toggleField = (toggleShow: boolean) => {
		setShowField(toggleShow);

		if (!toggleShow) {
			setField(initField);
		}
	};

	const handleAddField = () => {
		props.setFields((data) => [...data, field()]);
		toggleField(false);
	};

	return (
		<div class="my-6">
			<Show when={showField()}>
				<InputField
					id={`${props.fieldPrefix}-field-title`}
					label="Field Title"
					value={field().key}
					onInput={(value) => onInput({ key: value })}
				/>

				<InputField
					id={`${props.fieldPrefix}-field-value`}
					label="Field Value"
					value={field().value}
					onInput={(value) => onInput({ value })}
				/>

				<Button text="Add New Field" onClick={handleAddField} />
			</Show>

			<div>
				<Show
					when={showField()}
					fallback={
						<Button text="Show New Field" onClick={() => toggleField(true)} />
					}
				>
					<Button text="Hide New Field" onClick={() => toggleField(false)} />
				</Show>
			</div>
		</div>
	);
}
