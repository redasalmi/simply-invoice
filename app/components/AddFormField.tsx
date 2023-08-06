import * as React from 'react';
import { useFetcher } from '@remix-run/react';

import { FormField, Button } from '~/components';

import type { Field } from '~/types';

type AddFormFieldProps = {
	fieldPrefix: string;
	setFields: React.Dispatch<React.SetStateAction<Field[]>>;
};

const titleFieldId = 'field-title';
const contentFieldId = 'field-content';

export function AddFormField({ fieldPrefix, setFields }: AddFormFieldProps) {
	const fetcher = useFetcher();
	const [showField, setShowField] = React.useState(false);

	const toggleField = () => setShowField((show) => !show);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const title = formData.get(titleFieldId);
		const content = formData.get(contentFieldId);

		if (title && content) {
			setFields((fields) => [
				...fields,
				{
					name: `${fieldPrefix}-${title}`,
					label: title.toString(),
					defaultValue: content.toString(),
				},
			]);
			toggleField();
		}
	};

	return (
		<fetcher.Form onSubmit={handleSubmit}>
			{showField ? (
				<>
					<FormField name={titleFieldId} label="Field Title" className="my-1" />

					<FormField
						name={contentFieldId}
						label="Field Content"
						className="my-1"
					/>
				</>
			) : null}

			<div>
				<Button
					type="button"
					onClick={toggleField}
					text={`${showField ? 'Delete' : 'Add'} New Field`}
				/>

				{showField ? (
					<Button type="submit" text="Save New Field" className="ml-4" />
				) : null}
			</div>
		</fetcher.Form>
	);
}
