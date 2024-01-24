import * as React from 'react';
import { useFetcher } from '@remix-run/react';
import { nanoid } from 'nanoid';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Button, FormField } from '~/components/ui';
import { AddFormField, ModalPdfViewer } from '~/components';

import { intents, type Field, Intent } from '~/types';

const defaultCustomerFields: Field[] = [
	{
		key: nanoid(),
		name: 'customer-name',
		label: 'Name',
		value: '',
		showTitle: false,
	},
	{
		key: nanoid(),
		name: 'customer-email',
		label: 'Email',
		value: '',
		showTitle: false,
	},
	{
		key: nanoid(),
		name: 'customer-Address',
		label: 'Address',
		value: '',
		showTitle: false,
	},
];

function FormFields() {
	const [fields, setFields] = React.useState<Field[]>(defaultCustomerFields);

	const addField = (field: Field) => {
		setFields(fields.concat(field));
	};

	const moveField = (dragIndex: number, hoverIndex: number) => {
		setFields((prevFields) => {
			const movedFields = Array.from(prevFields);
			const temp = movedFields[dragIndex];
			movedFields[dragIndex] = movedFields[hoverIndex];
			movedFields[hoverIndex] = temp;

			return movedFields;
		});
	};

	const onFieldChange = (field: Field, fieldIndex: number) => {
		setFields(Object.assign([], fields, { [fieldIndex]: field }));
	};

	const removeField = (fieldIndex: number) => {
		setFields(fields.slice(0, fieldIndex).concat(fields.slice(fieldIndex + 1)));
	};

	return (
		<>
			{fields.map((field, index) => (
				<FormField
					key={field.key}
					field={field}
					fieldIndex={index}
					moveField={moveField}
					onFieldChange={(updatedField) => onFieldChange(updatedField, index)}
					removeField={() => removeField(index)}
					className="my-2"
				/>
			))}

			<AddFormField fieldPrefix="customer" addField={addField} />
		</>
	);
}

export default function NewInvoiceRoute() {
	const fetcher = useFetcher<string>();
	const [intent, setIntent] = React.useState<Intent | null>(null);

	const isLoading = fetcher.state !== 'idle';
	const pdfBase64 = isLoading ? null : fetcher.data;

	React.useEffect(() => {
		if (intent === intents.download && pdfBase64) {
			const link = document.createElement('a');
			link.href = pdfBase64;
			link.download = 'invoice.pdf';
			link.click();
		}
	}, [intent, pdfBase64]);

	return (
		<fetcher.Form action="/api/pdf" method="post">
			<h3 className="text-2xl">Customer Data</h3>
			<p className="block text-sm">fill all of your customer data below</p>

			<DndProvider backend={HTML5Backend}>
				<FormFields />
			</DndProvider>

			<div className="mt-32 flex gap-2">
				<ModalPdfViewer
					trigger={{
						text: 'Preview PDF',
						name: 'intent',
						value: intents.preview,
						type: 'submit',
						onClick: () => setIntent(intents.preview),
					}}
					pdfBase64={pdfBase64}
					isLoading={isLoading && intent === intents.preview}
				/>

				<Button
					type="submit"
					name="intent"
					value={intents.download}
					onClick={() => setIntent(intents.download)}
				>
					{isLoading && intent === intents.download
						? '...Loading PDF'
						: 'Download PDF'}
				</Button>

				<Button
					type="submit"
					name="intent"
					value={intents.save}
					onClick={() => setIntent(intents.save)}
				>
					{isLoading && intent === intents.save
						? '...Saving Invoice'
						: 'Save Invoice'}
				</Button>
			</div>
		</fetcher.Form>
	);
}
