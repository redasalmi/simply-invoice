import * as React from 'react';
import queryString from 'query-string';
import { useFetcher, redirect } from '@remix-run/react';
import { Reorder } from 'framer-motion';
import { renderToStream } from '@react-pdf/renderer';
import { nanoid } from 'nanoid';
import localforage from 'localforage';

import { Button, Dialog, DialogContent, DialogTrigger } from '~/components/ui';
import { AddFormField, InvoicePdf, FormField } from '~/components';
import { intents, type Intent, invoicesKey } from '~/constants';

import type { ActionFunctionArgs } from '@remix-run/node';
import type { ClientActionFunctionArgs } from '@remix-run/react';
import type { Field, Invoice, InvoiceField } from '~/types';

export async function action({ request }: ActionFunctionArgs) {
	const formQueryString = await request.text();
	const formData = queryString.parse(formQueryString, { sort: false });
	const intent = formData?.intent?.toString();

	const customer: Array<InvoiceField> = [];
	for (const [key, value] of Object.entries(formData)) {
		if (key.search('customer-') > -1 && value) {
			const label = key.replace('customer-', '').replace('[]', '');

			if (Array.isArray(value) && value[0]) {
				customer.push({
					label,
					value: value[0].trim(),
					showLabel: value[1] === 'on',
				});
			} else if (typeof value === 'string' && value) {
				customer.push({
					label,
					value: value.trim(),
				});
			}
		}
	}

	if (intent && [intents.download, intents.preview].includes(intent)) {
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

		return {
			intent,
			invoicePdf: `data:application/pdf;base64,${body.toString('base64')}`,
			invoice: {
				customer,
			},
		};
	}

	return {
		intent,
		invoicePdf: null,
		invoice: {
			customer,
		},
	};
}

export async function clientAction({ serverAction }: ClientActionFunctionArgs) {
	const data = await serverAction<typeof action>();

	if (data.intent !== intents.save) {
		return data;
	}

	const today = new Date().toLocaleDateString();
	const newInvoice: Invoice = Object.assign(
		{ id: nanoid(), createdAt: today },
		data.invoice,
	);
	const invoices = await localforage.getItem<Array<Invoice>>(invoicesKey);
	await localforage.setItem<Array<Invoice>>(
		invoicesKey,
		(invoices || []).concat(newInvoice),
	);

	return redirect('/invoices');
}

const defaultCustomerFields: Field[] = [
	{
		key: nanoid(),
		name: 'customer-name',
		label: 'Name',
		value: '',
		showLabel: false,
	},
	{
		key: nanoid(),
		name: 'customer-email',
		label: 'Email',
		value: '',
		showLabel: false,
	},
	{
		key: nanoid(),
		name: 'customer-address',
		label: 'Address',
		value: '',
		showLabel: false,
	},
];

export default function NewInvoiceRoute() {
	const fetcher = useFetcher<typeof action>();
	const [formFields, setFormFields] = React.useState<Field[]>(
		defaultCustomerFields,
	);
	const [intent, setIntent] = React.useState<Intent | null>(null);

	const isLoading = fetcher.state !== 'idle';
	const invoicePdf = isLoading ? null : fetcher.data?.invoicePdf;

	const addFormField = (field: Field) => {
		setFormFields(formFields.concat(field));
	};

	const onFormFieldChange = (formField: Field, fieldIndex: number) => {
		setFormFields(Object.assign([], formFields, { [fieldIndex]: formField }));
	};

	const removeFormField = (fieldIndex: number) => {
		setFormFields(
			formFields.slice(0, fieldIndex).concat(formFields.slice(fieldIndex + 1)),
		);
	};

	React.useEffect(() => {
		if (intent === intents.download && invoicePdf) {
			const link = document.createElement('a');
			link.href = invoicePdf;
			link.download = 'invoice.pdf';
			link.click();
		}
	}, [intent, invoicePdf]);

	return (
		<fetcher.Form method="post">
			<h3 className="text-2xl">Customer Data</h3>
			<p className="block text-sm">fill all of your customer data below</p>

			<Reorder.Group values={formFields} onReorder={setFormFields}>
				{formFields.map((formField, index) => (
					<Reorder.Item key={formField.key} value={formField}>
						<FormField
							key={formField.key}
							formField={formField}
							className="my-2"
							onFormFieldChange={(updatedFormField) =>
								onFormFieldChange(updatedFormField, index)
							}
							removeFormField={() => removeFormField(index)}
						/>
					</Reorder.Item>
				))}
			</Reorder.Group>

			<AddFormField fieldNamePrefix="customer" addFormField={addFormField} />

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
						{invoicePdf ? (
							<iframe
								title="invoice pdf"
								className="h-full w-full"
								src={`${invoicePdf}#toolbar=0&navpanes=0`}
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
