import * as React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import type { ActionFunctionArgs } from '@remix-run/node';
import {
	type ClientActionFunctionArgs,
	redirect,
	useFetcher,
	useLoaderData,
} from '@remix-run/react';
import { nanoid } from 'nanoid';
import queryString from 'query-string';
import { ulid } from 'ulid';
import { z } from 'zod';
import { InvoicePdf } from '~/components/InvoicePdf';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { ComboBox, type Option } from '~/components/ui/combobox';
import {
	type IdType,
	idTypes,
	type Intent,
	intents,
	locales,
} from '~/lib/constants';
import { countries } from '~/lib/currencies';
import { db } from '~/lib/db';
import { ServicesTable } from '~/components/ServicesTable';
import { newInvoiceLoaderSchema } from '~/schemas/invoice.schemas';
import type { Customer } from '~/types/customer.types';
import {
	getInvoiceClientLoaderData,
	parseCreateInvoiceLoaderErrors,
} from '~/utils/invoice.utils';

export async function clientLoader() {
	try {
		const { companies, customers, services, lastInvoiceId } =
			await getInvoiceClientLoaderData();
		newInvoiceLoaderSchema.parse({
			companiesLength: companies.length,
			customersLength: customers.length,
			servicesLength: services.length,
		});

		return {
			companies,
			customers,
			services,
			lastInvoiceId,
			error: null,
		};
	} catch (err) {
		const result = {
			companies: [],
			customers: [],
			services: [],
			lastInvoiceId: 0,
			error: 'An error occurred, please try again later!',
		};

		if (err instanceof z.ZodError) {
			result.error = parseCreateInvoiceLoaderErrors(err);

			return result;
		}

		return result;
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

	const today = new Date().toISOString();
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
		id: countryCode,
		name: `${countryName} - ${currencySymbol}`,
	}),
);

export default function NewInvoiceRoute() {
	const fetcher = useFetcher<typeof action>();
	const { companies, customers, services, lastInvoiceId, error } =
		useLoaderData<typeof clientLoader>();

	const invoiceIdRef = React.useRef<HTMLInputElement>(null);
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

	const handleInvoiceIdTypeChange = (option: Option | null) => {
		const idType = option?.id as IdType;
		let invoiceId: string | null = null;
		if (idType === 'incremental') {
			invoiceId = String(lastInvoiceId + 1);
		} else if (idType === 'random') {
			invoiceId = nanoid();
		}

		if (invoiceIdRef.current && invoiceId) {
			invoiceIdRef.current.value = invoiceId;
		}
	};

	return (
		<section>
			<fetcher.Form method="post">
				<div className="my-4 flex gap-3">
					<div>
						<Label htmlFor="invoice-id-type">Invoice ID Type</Label>
						{/* TODO: replace with a select component */}
						<ComboBox
							options={idTypes}
							input={{
								id: 'invoice-id-type',
								name: 'invoice-id-type',
								placeholder: 'Choose Invoice ID Type',
							}}
							onChangeCallback={handleInvoiceIdTypeChange}
						/>
					</div>

					<div>
						<Label>
							<span>Invoice ID</span>
							<Input ref={invoiceIdRef} name="invoice-id" readOnly />
						</Label>
					</div>
				</div>

				<div className="my-4 flex gap-3">
					<div>
						<Label htmlFor="locale">Invoice Language</Label>
						{/* TODO: replace with a select component */}
						<ComboBox
							options={locales}
							input={{
								id: 'locale',
								name: 'locale',
								placeholder: 'Choose a Language',
							}}
						/>
					</div>

					<div>
						<Label htmlFor="country-code">Currency</Label>
						<ComboBox
							options={currencies}
							input={{
								id: 'country-code',
								name: 'country-code',
								placeholder: 'Choose a Currency',
							}}
						/>
					</div>
				</div>

				<div className="my-4 flex gap-3">
					<div>
						<Label htmlFor="invoice-date">Invoice Date</Label>
						<Input type="date" name="invoice-date" id="invoice-date" />
					</div>

					<div>
						<Label htmlFor="due-date">Due Date</Label>
						<Input type="date" name="due-date" id="due-date" />
					</div>
				</div>

				<div className="my-4 flex gap-3">
					<div>
						<Label htmlFor="company-id">Company</Label>
						<ComboBox
							options={companies}
							input={{
								id: 'company-id',
								name: 'company-id',
								placeholder: 'Choose a Company',
							}}
						/>
					</div>

					<div>
						<Label htmlFor="customer-id">Customer</Label>
						<ComboBox
							options={customers}
							input={{
								id: 'customer-id',
								name: 'customer-id',
								placeholder: 'Choose a Customer',
							}}
						/>
					</div>
				</div>

				<div className="my-4">
					<ServicesTable services={services} />
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
