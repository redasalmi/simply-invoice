import * as React from 'react';
import {
	Form,
	useActionData,
	useLoaderData,
	useNavigation,
	type ClientLoaderFunctionArgs,
} from '@remix-run/react';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import type { Key } from 'react-aria-components';
import { Input } from '~/components/react-aria/input';
import { Label } from '~/components/react-aria/label';
import { TextAreaField } from '~/components/react-aria/text-area-field';
import { idTypes, type Intent, intents, locales } from '~/lib/constants';
import { countries } from '~/lib/currencies';
import { ServicesTable } from '~/components/ServicesTable';
import {
	createInvoiceSchema,
	newInvoiceLoaderSchema,
} from '~/schemas/invoice.schemas';
import {
	getInvoiceClientLoaderData,
	parseCreateInvoiceErrors,
	parseCreateInvoiceForm,
	parseCreateInvoiceLoaderErrors,
} from '~/utils/invoice.utils';
import { Button } from '~/components/react-aria/button';
import { Select, SelectItem } from '~/components/react-aria/select';
import { ComboBox } from '~/components/ui/combobox';

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

// TODO: no need for a server action here, if the intent is PDF preview or download
// the client action should call the server action after parsing the invoice data :p

// export async function action({ request }: ActionFunctionArgs) {
// 	// const formQueryString = await request.text();
// 	// const formData = queryString.parse(formQueryString, { sort: false });
// 	// const intent = formData?.intent?.toString();

// 	try {
// 		const formData = await request.formData();
// 		const invoiceFormData = parseCreateInvoiceForm(formData);
// 		// const newInvoice = createInvoiceSchema.parse(invoiceFormData);

// 		return {};
// 	} catch (err) {
// 		console.log(err);

// 		return {};
// 	}

// 	// const customer: Customer = {
// 	// 	name: formData['customer[name]']?.toString(),
// 	// 	email: formData['customer[email]']?.toString(),
// 	// 	custom: [],
// 	// };

// 	// for (const [key, value] of Object.entries(formData)) {
// 	// 	if (key.search('customer-custom') > -1 && value) {
// 	// 		const label = key
// 	// 			.replace('customer-custom[', '')
// 	// 			.replaceAll('-', ' ')
// 	// 			.replace(']', '');

// 	// 		if (Array.isArray(value) && value[0]) {
// 	// 			customer.custom.push({
// 	// 				label,
// 	// 				value: value[0].trim(),
// 	// 				showLabel: value[1] === 'on',
// 	// 			});
// 	// 		} else if (typeof value === 'string' && value) {
// 	// 			customer.custom.push({
// 	// 				label,
// 	// 				value: value.trim(),
// 	// 			});
// 	// 		}
// 	// 	}
// 	// }

// 	// if (intent && [intents.download, intents.preview].includes(intent)) {
// 	// 	const stream = await renderToStream(<InvoicePdf data={{ customer }} />);

// 	// 	const body: Buffer = await new Promise((resolve, reject) => {
// 	// 		const buffers: Array<Uint8Array> = [];
// 	// 		stream.on('data', (data) => {
// 	// 			buffers.push(data);
// 	// 		});
// 	// 		stream.on('end', () => {
// 	// 			resolve(Buffer.concat(buffers));
// 	// 		});
// 	// 		stream.on('error', reject);
// 	// 	});

// 	// 	return {
// 	// 		intent,
// 	// 		invoicePdf: `data:application/pdf;base64,${body.toString('base64')}`,
// 	// 		invoice: {
// 	// 			customer,
// 	// 		},
// 	// 	};
// 	// }

// 	// return {
// 	// 	intent,
// 	// 	invoicePdf: null,
// 	// 	invoice: {
// 	// 		customer,
// 	// 	},
// 	// };
// }

export async function clientAction({ request }: ClientLoaderFunctionArgs) {
	try {
		const formData = await request.formData();
		const invoiceFormData = parseCreateInvoiceForm(formData);
		const parsedInvoice = createInvoiceSchema.parse(invoiceFormData);

		return {};
	} catch (err) {
		if (err instanceof z.ZodError) {
			const errors = parseCreateInvoiceErrors(err);

			return {
				errors,
			};
		}
	}

	// if (data.intent !== intents.save) {
	// 	return data;
	// }

	// const today = new Date().toISOString();
	// const newInvoice = Object.assign(
	// 	{
	// 		id: ulid(),
	// 		createdAt: today,
	// 	},
	// 	data.invoice,
	// );

	// await db.invoices.add(newInvoice);

	// return redirect('/invoices');
}

export function HydrateFallback() {
	return null;
}

const currencies = countries.map(
	({ countryName, currencySymbol, countryCode }) => ({
		id: countryCode,
		name: `${countryName} - ${currencySymbol}`,
		value: countryCode,
	}),
);

export default function NewInvoiceRoute() {
	// const fetcher = useFetcher(); // TODO: why is there a fetcher here lol?
	const navigation = useNavigation();
	const { companies, customers, services, lastInvoiceId, error } =
		useLoaderData<typeof clientLoader>();
	const actionData = useActionData<typeof clientAction>();

	const invoiceIdRef = React.useRef<HTMLInputElement>(null);
	// const [intent, setIntent] = React.useState<Intent | null>(null);

	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';
	// const isLoading = fetcher.state !== 'idle';
	// const invoicePdf = isLoading ? null : fetcher.data?.invoicePdf;

	// React.useEffect(() => {
	// 	if (intent === intents.download && invoicePdf) {
	// 		const link = document.createElement('a');
	// 		link.href = invoicePdf;
	// 		link.download = 'invoice.pdf';
	// 		link.click();
	// 	}
	// }, [intent, invoicePdf]);

	if (error) {
		return (
			<section>
				<div>
					<p>{error}</p>
				</div>
			</section>
		);
	}

	// TODO: fix param type to be IdType
	const handleInvoiceIdTypeChange = (idType: Key) => {
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
			<Form method="post">
				<div className="my-4 flex gap-3">
					<div>
						<Select
							id="invoice-id-type"
							name="invoice-id-type"
							label="Invoice ID Type"
							placeholder="Choose invoice ID type"
							onSelectionChange={handleInvoiceIdTypeChange}
							isRequired
							errorMessage={actionData?.errors?.['invoice-id-type']}
						>
							{idTypes.map(({ id, name }) => (
								<SelectItem key={id} id={id}>
									{name}
								</SelectItem>
							))}
						</Select>
					</div>

					<div>
						<Label>
							<span>Invoice ID</span>
							<Input
								ref={invoiceIdRef}
								name="invoice-id"
								readOnly
								className="rounded-md border-2"
							/>
						</Label>
					</div>
				</div>

				<div className="my-4 flex gap-3">
					<div>
						<Select
							id="locale"
							name="locale"
							label="Invoice Language"
							placeholder="Choose a language"
							isRequired
							errorMessage={actionData?.errors?.locale}
						>
							{locales.map(({ id, name }) => (
								<SelectItem key={id} id={id}>
									{name}
								</SelectItem>
							))}
						</Select>
					</div>

					<div>
						<ComboBox
							id="country-code"
							name="country-code"
							label="Currency"
							placeholder="Select a currency"
							errorMessage={actionData?.errors?.['customer-id']}
							listItems={currencies}
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
						<ComboBox
							id="company-id"
							name="company-id"
							label="Company"
							placeholder="Select a company"
							errorMessage={actionData?.errors?.['company-id']}
							listItems={companies}
						/>
					</div>

					<div>
						<ComboBox
							id="customer-id"
							name="customer-id"
							label="Customer"
							placeholder="Select a customer"
							errorMessage={actionData?.errors?.['customer-id']}
							listItems={customers}
						/>
					</div>
				</div>

				<div className="my-4">
					{/* TODO: maybe add a service-order field to save the services order */}
					<ServicesTable services={services} />
				</div>

				<div className="my-4">
					<TextAreaField label="Note" name="note" />
				</div>

				<div className="flex items-center gap-2">
					<Button type="submit" name="intent" value={intents.preview}>
						Preview Invoice
					</Button>
					<Button type="submit" name="intent" value={intents.download}>
						Download Invoice
					</Button>
					<Button type="submit" name="intent" value={intents.save}>
						Save Invoice
					</Button>
				</div>
			</Form>
		</section>
	);
}
