import * as React from 'react';
import { nanoid } from 'nanoid';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import type { CustomField } from '~/lib/types';

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
	const [labelError, setLabelError] = React.useState(false);
	const [contentError, setContentError] = React.useState(false);

	React.useEffect(() => {
		if (showField) {
			labelRef.current?.focus();
		}
	}, [showField]);

	const toggleField = () => {
		setShowField((show) => !show);
	};

	const addNewField = () => {
		const label = labelRef.current?.value;
		const content = contentRef.current?.value;
		setLabelError(!label);
		setContentError(!content);

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
							Label *{' '}
							{labelError ? (
								<span className="text-red-500">(Label is required)</span>
							) : null}
						</Label>
						<Input
							ref={labelRef}
							id={labelId}
							variant={labelError ? 'error' : 'default'}
						/>
					</div>

					<div className="my-2">
						<Label htmlFor={contentId} className="mb-1 block">
							Content *{' '}
							{contentError ? (
								<span className="text-red-500">(Content is required)</span>
							) : null}
						</Label>
						<Input
							ref={contentRef}
							id={contentId}
							variant={contentError ? 'error' : 'default'}
						/>
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
