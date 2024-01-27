import * as React from 'react';
import queryString from 'query-string';
import { redirect, type ActionFunctionArgs } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { Reorder } from 'framer-motion';
import { renderToStream } from '@react-pdf/renderer';
import { nanoid } from 'nanoid';

import {
	Button,
	FormField,
	Dialog,
	DialogContent,
	DialogTrigger,
} from '~/components/ui';
import { AddFormField, InvoicePdf, PdfEntry } from '~/components';

import { intents } from '~/types';
import type { Intent, Field } from '~/types';

export async function action({ request }: ActionFunctionArgs) {
	const formQueryString = await request.text();
	const formData = queryString.parse(formQueryString, { sort: false });
	const intent = formData?.intent?.toString();

	if (intent && [intents.download, intents.preview].includes(intent)) {
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

		const stream = await renderToStream(<InvoicePdf data={{ customer }} />);

		const body: Buffer = await new Promise((resolve, reject) => {
			const buffers: Uint8Array[] = [];
			stream.on('data', (data) => {
				buffers.push(data);
			});
			stream.on('end', () => {
				resolve(Buffer.concat(buffers));
			});
			stream.on('error', reject);
		});

		return `data:application/pdf;base64,${body.toString('base64')}`;
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

export default function NewInvoiceRoute() {
	const fetcher = useFetcher<string>();
	const [fields, setFields] = React.useState<Field[]>(defaultCustomerFields);
	const [intent, setIntent] = React.useState<Intent | null>(null);

	const isLoading = fetcher.state !== 'idle';
	const base64Pdf = isLoading ? null : fetcher.data;

	const addField = (field: Field) => {
		setFields(fields.concat(field));
	};

	const onFieldChange = (field: Field, fieldIndex: number) => {
		setFields(Object.assign([], fields, { [fieldIndex]: field }));
	};

	const removeField = (fieldIndex: number) => {
		setFields(fields.slice(0, fieldIndex).concat(fields.slice(fieldIndex + 1)));
	};

	React.useEffect(() => {
		if (intent === intents.download && base64Pdf) {
			const link = document.createElement('a');
			link.href = base64Pdf;
			link.download = 'invoice.pdf';
			link.click();
		}
	}, [intent, base64Pdf]);

	return (
		<fetcher.Form method="post">
			<h3 className="text-2xl">Customer Data</h3>
			<p className="block text-sm">fill all of your customer data below</p>

			<Reorder.Group values={fields} onReorder={setFields}>
				{fields.map((field, index) => (
					<Reorder.Item key={field.key} value={field}>
						<FormField
							key={field.key}
							field={field}
							className="my-2"
							onFieldChange={(updatedField) =>
								onFieldChange(updatedField, index)
							}
							removeField={() => removeField(index)}
						/>
					</Reorder.Item>
				))}
			</Reorder.Group>

			<AddFormField fieldPrefix="customer" addField={addField} />

			<div className="mt-32 flex gap-2">
				<Dialog>
					<DialogTrigger
						type="submit"
						name="intent"
						value={intents.preview}
						onClick={() => setIntent(intents.preview)}
						className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
					>
						{isLoading && intent === intents.preview
							? '...Loading PDF'
							: 'Preview PDF'}
					</DialogTrigger>
					<DialogContent className="h-full max-h-[80%] max-w-[80%]">
						{base64Pdf ? (
							<iframe
								title="invoice pdf"
								className="h-full w-full"
								src={`${base64Pdf}#toolbar=0&navpanes=0`}
							/>
						) : null}
					</DialogContent>
				</Dialog>

				<Button
					type="submit"
					name="intent"
					value={intents.download}
					onClick={() => setIntent(intents.download)}
				>
					{isLoading && intent === intents.download
						? '...Downloading PDF'
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
