import * as React from 'react';
import { Form } from 'react-router';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { Label } from '~/components/ui/label';
import {
	type IdType,
	idTypes,
	idTypesList,
	// type Intent,
	intents,
	localesList,
} from '~/lib/constants';
import { countries } from '~/lib/currencies';
import { ServicesTable } from '~/components/ServicesTable';
import {
	// createInvoiceSchema,
	newInvoiceLoaderSchema,
} from '~/schemas/invoice.schemas';
import {
	getInvoiceClientLoaderData,
	parseCreateInvoiceErrors,
	// parseCreateInvoiceForm,
	parseCreateInvoiceLoaderErrors,
} from '~/utils/invoice.utils';
import { Button } from '~/components/ui/button';
import { Combobox } from '~/components/ui/combobox';
import { Select } from '~/components/ui/select';
import { FormRoot } from '~/components/ui/form';
import { FormField } from '~/components/FormField';
import type * as Route from './+types.invoice-create';

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

export async function clientAction() {
	try {
		// const formData = await request.formData();
		// const invoiceFormData = parseCreateInvoiceForm(formData);
		// const parsedInvoice = createInvoiceSchema.parse(invoiceFormData);

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
	}),
);

export default function InvoiceCreateRoute({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	// const fetcher = useFetcher(); // TODO: why is there a fetcher here lol?
	// const navigation = useNavigation();
	const { companies, customers, services, lastInvoiceId, error } = loaderData;

	const [invoiceId, setInvoiceId] = React.useState<string | undefined>(
		undefined,
	);

	// const [intent, setIntent] = React.useState<Intent | null>(null);

	// const isLoading = navigation.state !== 'idle';
	// const isSubmitting = navigation.state === 'submitting';
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

	const handleInvoiceIdTypeChange = (idType: IdType) => {
		let invoiceIdValue: string | undefined = undefined;
		if (idType === idTypes.incremental) {
			invoiceIdValue = String(lastInvoiceId + 1);
		} else if (idType === idTypes.random) {
			invoiceIdValue = nanoid();
		}

		setInvoiceId(invoiceIdValue);
	};

	return (
		<section>
			<FormRoot asChild>
				<Form method="post">
					<div className="my-4 flex gap-3">
						<Select
							id="invoice-id-type"
							name="invoice-id-type"
							label="Invoice ID Type"
							placeholder="Choose invoice ID type"
							errorMessage={actionData?.errors?.['invoice-id-type']}
							listItems={idTypesList}
							onSelectedItemChange={handleInvoiceIdTypeChange}
						/>

						<FormField
							id="invoice-id"
							label="Invoice ID"
							name="invoice-id"
							serverError={actionData?.errors?.['invoice-id']}
							defaultValue={invoiceId}
							readOnly
						/>
					</div>

					<div className="my-4 flex gap-3">
						<Select
							id="locale"
							name="locale"
							label="Invoice Language"
							placeholder="Choose a language"
							errorMessage={actionData?.errors?.locale}
							listItems={localesList}
						/>

						<Combobox
							id="country-code"
							name="country-code"
							label="Currency"
							placeholder="Select a currency"
							errorMessage={actionData?.errors?.['customer-id']}
							listItems={currencies}
						/>
					</div>

					<div className="my-4 flex gap-3">
						<FormField
							id="invoice-date"
							label="Invoice Date"
							name="invoice-date"
							type="date"
							serverError={actionData?.errors?.['invoice-date']}
						/>

						<FormField
							id="due-date"
							label="Due Date"
							name="due-date"
							type="date"
						/>
					</div>

					<div className="my-4 flex gap-3">
						<Combobox
							id="company-id"
							name="company-id"
							label="Company"
							placeholder="Select a company"
							errorMessage={actionData?.errors?.['company-id']}
							listItems={companies}
						/>

						<Combobox
							id="customer-id"
							name="customer-id"
							label="Customer"
							placeholder="Select a customer"
							errorMessage={actionData?.errors?.['customer-id']}
							listItems={customers}
						/>
					</div>

					<div className="my-4">
						{/* TODO: maybe add a service-order field to save the services order */}
						<ServicesTable services={services} />
					</div>

					<div className="my-4">
						<Label htmlFor="note">Note</Label>
						<textarea name="note" id="note"></textarea>
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
			</FormRoot>
		</section>
	);
}
