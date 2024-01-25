import * as React from 'react';
import queryString from 'query-string';
import { redirect, type ActionFunctionArgs } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { nanoid } from 'nanoid';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Button, FormField, buttonVariants } from '~/components/ui';
import {
	AddFormField,
	ClientOnly,
	InvoicePdf,
	Modal,
	PdfEntry,
} from '~/components';
import { cn } from '~/lib/utils';

import { type Field } from '~/types';

export async function action({ request }: ActionFunctionArgs) {
	const formQueryString = await request.text();
	const formData = queryString.parse(formQueryString, { sort: false });

	const customer: Record<string, PdfEntry> = {};
	for (const [key, value] of Object.entries(formData)) {
		if (key.search('customer-') > -1 && value) {
			const field = key.replace('customer-', '').replace('[]', '');

			if (Array.isArray(value) && value[0]) {
				customer[field] = {
					value: value[0].trim(),
					showTitle: value[1] === 'on',
				};
			} else if (typeof value === 'string' && value) {
				customer[field] = {
					value: value.trim(),
				};
			}
		}
	}

	return redirect('/invoices');
}

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
	const isLoading = fetcher.state !== 'idle';

	return (
		<fetcher.Form method="post">
			<h3 className="text-2xl">Customer Data</h3>
			<p className="block text-sm">fill all of your customer data below</p>

			<DndProvider backend={HTML5Backend}>
				<FormFields />
			</DndProvider>

			<div className="mt-32 flex gap-2">
				<Modal
					triggerText="Preview PDF"
					triggerClassName="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
					contentClassName="h-full max-h-[80%] max-w-[80%]"
				>
					<PDFViewer className="h-full w-full">
						<InvoicePdf data={{ customer: {} }} />
					</PDFViewer>
				</Modal>

				<ClientOnly fallback={<Button type="button">Download PDF</Button>}>
					<PDFDownloadLink
						fileName="invoice.pdf"
						document={<InvoicePdf data={{ customer: {} }} />}
						className={cn(buttonVariants({ variant: 'default' }))}
					>
						Download PDF
					</PDFDownloadLink>
				</ClientOnly>

				<Button type="submit">
					{isLoading ? '...Saving Invoice' : 'Save Invoice'}
				</Button>
			</div>
		</fetcher.Form>
	);
}
