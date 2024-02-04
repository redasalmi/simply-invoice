import * as React from 'react';
import { nanoid } from 'nanoid';

import { Button, Label, Input } from '~/components/ui';

import type { CustomField } from '~/types';

type AddFormFieldProps = {
	addFormField: (field: CustomField) => void;
	children?: React.ReactNode;
};

export function AddFormField({ addFormField, children }: AddFormFieldProps) {
	const labelId = React.useId();
	const contentId = React.useId();
	const labelRef = React.useRef<HTMLInputElement>(null);
	const contentRef = React.useRef<HTMLInputElement>(null);
	const [showField, setShowField] = React.useState(false);

	const toggleField = () => {
		setShowField((show) => !show);
	};

	const addNewField = () => {
		const label = labelRef.current?.value;
		const content = contentRef.current?.value;

		if (label && content) {
			addFormField({
				id: nanoid(),
				label: label.trim(),
				content: content.trim(),
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
						<Label htmlFor={labelId} className="mb-1 block">
							Label
						</Label>
						<Input ref={labelRef} id={labelId} />
					</div>

					<div className="my-2">
						<Label htmlFor={contentId} className="mb-1 block">
							Content
						</Label>
						<Input ref={contentRef} id={contentId} />
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
