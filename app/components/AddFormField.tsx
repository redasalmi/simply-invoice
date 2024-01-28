import * as React from 'react';
import { nanoid } from 'nanoid';

import { Button, Label, Input } from '~/components/ui';

import type { Field } from '~/types';

type AddFormFieldProps = {
	fieldNamePrefix: string;
	addFormField: (field: Field) => void;
};

const titleField = 'title-field';
const contentField = 'content-field';

export function AddFormField({
	fieldNamePrefix,
	addFormField,
}: AddFormFieldProps) {
	const titleRef = React.useRef<HTMLInputElement>(null);
	const contentRef = React.useRef<HTMLInputElement>(null);
	const [showField, setShowField] = React.useState(false);

	const titleFieldId = `${fieldNamePrefix}-${titleField}`;
	const contentFieldId = `${fieldNamePrefix}-${contentField}`;

	const toggleField = () => {
		setShowField((show) => !show);
	};

	const addNewField = () => {
		const title = titleRef.current?.value;
		const content = contentRef.current?.value;

		if (title && content) {
			addFormField({
				key: nanoid(),
				name: `${fieldNamePrefix}-${title.trim()}`,
				label: title.trim(),
				value: content.trim(),
				showLabel: false,
			});
			setShowField(false);
		}
	};

	return (
		<>
			{showField ? (
				<div className="my-2">
					<div className="my-2">
						<Label htmlFor={titleFieldId} className="mb-1 block">
							Title
						</Label>
						<Input ref={titleRef} id={titleFieldId} name={titleFieldId} />
					</div>

					<div className="my-2">
						<Label htmlFor={contentFieldId} className="mb-1 block">
							Content
						</Label>
						<Input ref={contentRef} id={contentFieldId} name={contentFieldId} />
					</div>
				</div>
			) : null}

			<div className="my-2">
				<Button type="button" onClick={toggleField}>
					{showField ? 'Delete' : 'Add'} New Field
				</Button>

				{showField ? (
					<Button type="button" onClick={addNewField} className="ml-2">
						Save New Field
					</Button>
				) : null}
			</div>
		</>
	);
}
