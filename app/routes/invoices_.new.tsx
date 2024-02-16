import * as React from 'react';
import queryString from 'query-string';
import { useFetcher, redirect } from '@remix-run/react';
import { Reorder } from 'framer-motion';
import { renderToStream } from '@react-pdf/renderer';
import { nanoid } from 'nanoid';

import { Button, Dialog, DialogContent, DialogTrigger } from '~/components/ui';
import {
	AddFormField,
	InvoicePdf,
	FormField,
	UncontrolledFormField,
} from '~/components';
import { invoicesStore } from '~/lib/stores';

import type { ActionFunctionArgs } from '@remix-run/node';
import type { ClientActionFunctionArgs } from '@remix-run/react';
import type { Customer, Field, Invoice } from '~/lib/types';

const intents = {
	preview: 'preview',
	download: 'download',
	save: 'save',
} as const;

type Intent = (typeof intents)[keyof typeof intents];

export async function action({ request }: ActionFunctionArgs) {
	const formQueryString = await request.text();
	const formData = queryString.parse(formQueryString, { sort: false });
	const intent = formData?.intent?.toString();

	const customer: Customer = {
		name: formData['customer[name]']?.toString(),
		email: formData['customer[email]']?.toString(),
		custom: [],
	};

	for (const [key, value] of Object.entries(formData)) {
		if (key.search('customer-custom') > -1 && value) {
			const label = key
				.replace('customer-custom[', '')
				.replaceAll('-', ' ')
				.replace(']', '');

			if (Array.isArray(value) && value[0]) {
				customer.custom.push({
					label,
					value: value[0].trim(),
					showLabel: value[1] === 'on',
				});
			} else if (typeof value === 'string' && value) {
				customer.custom.push({
					label,
					value: value.trim(),
				});
			}
		}
	}

	if (intent && [intents.download, intents.preview].includes(intent)) {
		const stream = await renderToStream(<InvoicePdf data={{ customer }} />);

		const body: Buffer = await new Promise((resolve, reject) => {
			const buffers: Array<Uint8Array> = [];
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

	const invoiceId = nanoid();
	const today = new Date().toLocaleDateString();
	const newInvoice = Object.assign(
		{
			id: invoiceId,
			createdAt: today,
		},
		data.invoice,
	);

	await invoicesStore.setItem<Invoice>(invoiceId, newInvoice);

	return redirect('/invoices');
}

const customerFields: Array<Pick<Field, 'key' | 'name' | 'label'>> = [
	{
		key: nanoid(),
		name: 'customer[name]',
		label: 'Name',
	},
	{
		key: nanoid(),
		name: 'customer[email]',
		label: 'Email',
	},
];

const addressFields: Array<Pick<Field, 'key' | 'name' | 'label'>> = [
	{
		key: nanoid(),
		name: 'address1',
		label: 'Address 1',
	},
	{
		key: nanoid(),
		name: 'address2',
		label: 'Address 2',
	},
	{
		key: nanoid(),
		name: 'country',
		label: 'Country',
	},
	{
		key: nanoid(),
		name: 'province',
		label: 'Province',
	},
	{
		key: nanoid(),
		name: 'city',
		label: 'City',
	},
	{
		key: nanoid(),
		name: 'zip',
		label: 'Zip',
	},
];

export default function NewInvoiceRoute() {
	const fetcher = useFetcher<typeof action>();
	const [formFields, setFormFields] = React.useState<Array<Field>>([]);
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
		<section>
			<fetcher.Form method="post">
				<div>
					<h3 className="text-2xl">Customer Data</h3>
					<p className="block text-sm">Fill your customer data </p>

					<div>
						{customerFields.map((field) => (
							<UncontrolledFormField
								key={field.key}
								className="my-2"
								formField={field}
							/>
						))}
					</div>
				</div>

				<div>
					<h3 className="text-2xl">Address</h3>
					<p className="block text-sm">Fill your customer address </p>

					<div>
						{addressFields.map((field) => (
							<UncontrolledFormField
								key={field.key}
								className="my-2"
								formField={field}
							/>
						))}
					</div>
				</div>

				<AddFormField fieldNamePrefix="customer" addFormField={addFormField}>
					<h3 className="text-2xl">Custom fields</h3>
					<p className="mb-2 block text-sm">
						Add any custom fields and order them
					</p>

					{formFields.length ? (
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
					) : null}
				</AddFormField>

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
		</section>
	);
}
