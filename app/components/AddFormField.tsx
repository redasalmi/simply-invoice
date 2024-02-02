import * as React from 'react';
import { nanoid } from 'nanoid';

import { Button, Label, Input } from '~/components/ui';

import type { Field } from '~/types';

type AddFormFieldProps = {
	fieldNamePrefix: string;
	addFormField: (field: Field) => void;
	children?: React.ReactNode;
};

const labelField = 'label-field';
const contentField = 'content-field';

export function AddFormField({
	fieldNamePrefix,
	addFormField,
	children,
}: AddFormFieldProps) {
	const labelRef = React.useRef<HTMLInputElement>(null);
	const contentRef = React.useRef<HTMLInputElement>(null);
	const [showField, setShowField] = React.useState(false);

	const labelFieldId = `${fieldNamePrefix}-${labelField}`;
	const contentFieldId = `${fieldNamePrefix}-${contentField}`;

	const toggleField = () => {
		setShowField((show) => !show);
	};

	const addNewField = () => {
		const label = labelRef.current?.value;
		const content = contentRef.current?.value;

		if (label && content) {
			addFormField({
				key: nanoid(),
				name: `${fieldNamePrefix}-custom[${label.trim()}]`,
				label: label.trim(),
				value: content.trim(),
				showLabel: false,
			});
			setShowField(false);
		}
	};

	return (
		<div className="my-2">
			{children}

			{showField ? (
				<div className="my-2">
					<div className="my-2">
						<Label htmlFor={labelFieldId} className="mb-1 block">
							Label
						</Label>
						<Input ref={labelRef} id={labelFieldId} name={labelFieldId} />
					</div>

					<div className="my-2">
						<Label htmlFor={contentFieldId} className="mb-1 block">
							Content
						</Label>
						<Input ref={contentRef} id={contentFieldId} name={contentFieldId} />
					</div>
				</div>
			) : null}

			<Button type="button" onClick={toggleField}>
				{showField ? 'Delete' : 'Add'} New Field
			</Button>

			{showField ? (
				<Button type="button" onClick={addNewField} className="ml-2">
					Save New Field
				</Button>
			) : null}
		</div>
	);
}
