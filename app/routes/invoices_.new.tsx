import * as React from 'react';

import { renderToStream } from '@react-pdf/renderer';
import type { ActionFunctionArgs } from '@remix-run/node';
import { redirect, useFetcher, useLoaderData } from '@remix-run/react';
import type { ClientActionFunctionArgs } from '@remix-run/react';
import queryString from 'query-string';
import { ulid } from 'ulid';
import { z } from 'zod';

import { InvoicePdf } from '~/components/InvoicePdf';
import { Combobox } from '~/components/ui/combobox';
import { DatePicker } from '~/components/ui/date-picker';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';

import { idTypes, intents, locales } from '~/lib/constants';
import type { IdType, Intent } from '~/lib/constants';
import { countries } from '~/lib/currencies';
import { db } from '~/lib/db';
import { newInvoiceLoaderSchema } from '~/lib/schemas';
import type { NewInvoiceLoaderSchemaErrors } from '~/lib/schemas';
import type { Customer } from '~/lib/types';

export async function clientLoader() {
	try {
		const [companies, customers, services, invoice] = await Promise.all([
			db.companies.toArray(),
			db.customers.toArray(),
			db.services.toArray(),
			db.invoices.where({ invoiceIdType: 'incremental' as IdType }).last(),
		]);
		newInvoiceLoaderSchema.parse({
			companiesLength: companies.length,
			customersLength: customers.length,
			servicesLength: services.length,
		});

		return {
			companies: companies.map(({ id, name }) => ({
				label: name,
				value: id,
			})),
			customers: customers.map(({ id, name }) => ({
				label: name,
				value: id,
			})),
			services: services.map(({ id, name }) => ({
				label: name,
				value: id,
			})),
			lastInvoiceId: invoice?.id ? Number(invoice.id) : 0,
			error: null,
		};
	} catch (err) {
		if (err instanceof z.ZodError) {
			const zodErrors: NewInvoiceLoaderSchemaErrors = err.format();
			const errorsType: Array<string> = [];

			if (zodErrors.companiesLength?._errors?.[0]) {
				errorsType.push('company');
			}
			if (zodErrors.customersLength?._errors?.[0]) {
				errorsType.push('customer');
			}
			if (zodErrors.servicesLength?._errors?.[0]) {
				errorsType.push('service');
			}

			const error = `At least one ${errorsType.join(', ')} need${errorsType.length > 1 ? 's' : ''} to be available to create an invoice! Please create the needed data to move forward and enable invoice creation.`;

			return {
				companies: [],
				customers: [],
				services: [],
				lastInvoiceId: 0,
				error,
			};
		}
	}
}

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

	const today = new Date().toLocaleDateString();
	const newInvoice = Object.assign(
		{
			id: ulid(),
			createdAt: today,
		},
		data.invoice,
	);

	await db.invoices.add(newInvoice);

	return redirect('/invoices');
}

export function HydrateFallback() {
	return null;
}

const currencies = countries.map(
	({ countryName, currencySymbol, countryCode }) => ({
		label: `${countryName} - ${currencySymbol}`,
		value: countryCode,
	}),
);

export default function NewInvoiceRoute() {
	const fetcher = useFetcher<typeof action>();
	const { companies, customers, services, lastInvoiceId, error } =
		useLoaderData<typeof clientLoader>();

	const [intent, setIntent] = React.useState<Intent | null>(null);

	const isLoading = fetcher.state !== 'idle';
	const invoicePdf = isLoading ? null : fetcher.data?.invoicePdf;

	React.useEffect(() => {
		if (intent === intents.download && invoicePdf) {
			const link = document.createElement('a');
			link.href = invoicePdf;
			link.download = 'invoice.pdf';
			link.click();
		}
	}, [intent, invoicePdf]);

	if (error) {
		return (
			<section>
				<div>
					<p>{error}</p>
				</div>
			</section>
		);
	}

	return (
		<section>
			<fetcher.Form method="post">
				<div>
					<div className="my-4">
						<Combobox
							label="ID type"
							inputName="invoice-id-type"
							inputPlaceholder="Choose Invoice ID Type"
							list={idTypes}
						/>
					</div>

					<div>
						<Combobox
							label="Invoice Language"
							inputName="locale"
							inputPlaceholder="Choose a Language"
							list={locales}
						/>
					</div>

					<div>
						<Combobox
							label="Currency"
							inputName="country-code"
							inputPlaceholder="Choose a Currency"
							list={currencies}
						/>
					</div>
				</div>

				<div className="my-4">
					<div className="my-2">
						<p>Invoice Date</p>
						<DatePicker inputName="invoice-date" />
					</div>

					<div className="my-2">
						<p>Due Date</p>
						<DatePicker inputName="due-date" />
					</div>
				</div>

				<div className="my-4 flex flex-col gap-2">
					<div>
						<Combobox
							label="Company"
							inputName="company-id"
							inputPlaceholder="Choose a Company"
							list={companies}
						/>
					</div>

					<div>
						<Combobox
							label="Customer"
							inputName="customer-id"
							inputPlaceholder="Choose a Customer"
							list={customers}
						/>
					</div>
				</div>

				<div className="my-4">
					<Label>
						<span>Note</span>
						<Textarea name="note" />
					</Label>
				</div>
			</fetcher.Form>
		</section>
	);
}
