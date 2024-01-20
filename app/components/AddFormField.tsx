import * as React from 'react';
import { nanoid } from 'nanoid';

import { Button, Label, Input } from '~/components/ui';

import { type Field } from '~/types';

type AddFormFieldProps = {
	fieldPrefix: string;
	addField: (field: Field) => void;
};

const titleField = 'title-field';
const contentField = 'content-field';

export function AddFormField({ fieldPrefix, addField }: AddFormFieldProps) {
	const titleRef = React.useRef<HTMLInputElement>(null);
	const contentRef = React.useRef<HTMLInputElement>(null);
	const [showField, setShowField] = React.useState(false);

	const titleFieldId = `${fieldPrefix}-${titleField}`;
	const contentFieldId = `${fieldPrefix}-${contentField}`;

	const toggleField = () => {
		setShowField((show) => !show);
	};

	const addNewField = () => {
		const title = titleRef.current?.value;
		const content = contentRef.current?.value;

		if (title && content) {
			addField({
				key: nanoid(),
				name: `${fieldPrefix}-${title.trim()}`,
				label: title.trim(),
				value: content.trim(),
				showTitle: false,
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
