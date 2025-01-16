import * as React from 'react';
import { Link, useNavigation } from 'react-router';
import { nanoid } from 'nanoid';
import {
	identifierTypes,
	identifierTypesList,
	localesList,
	type IdentifierType,
} from '~/lib/constants';
import { Form } from '~/components/ui/form';
import { Select } from '~/components/ui/select';
import { Combobox } from '~/components/ui/combobox';
import { RichTextEditor } from '~/components/rich-text/editor';
import { Button } from '~/components/ui/button';
import {
	FieldControl,
	FieldError,
	FieldLabel,
	FieldRoot,
} from '~/components/ui/field';
import { currencies } from '~/lib/currencies';
import {
	invoiceServiceIntents,
	InvoiceServicesTable,
} from '~/routes/invoices/components/InvoiceServicesTable';
import { useForm } from '~/hooks/useForm';
import { InvoiceFormSchema } from '~/routes/invoices/invoice.schemas';
import type { Route } from './+types/route';

export function InvoiceUpdateRoute({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const { data, errors: loaderErrors } = loaderData;

	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	const [invoiceId, setInvoiceId] = React.useState(() =>
		data?.invoice?.identifier
			? data.invoice.identifier
			: String((data?.lastIncrementalInvoiceId || 0) + 1),
	);

	const { errors, resetErrors, handleSubmit } = useForm({
		schema: InvoiceFormSchema,
		actionErrors: actionData?.errors,
	});

	if (loaderErrors?.nested) {
		const errorsList = Object.values(loaderErrors.nested).flat();

		return (
			<section>
				<ul>
					{errorsList.map((error, index) => (
						<li key={index} className="list-disc">
							{error}
						</li>
					))}
				</ul>
			</section>
		);
	}

	if (!data) {
		return (
			<section>
				<p>
					An error has occurred when loading your data, please try again later!
				</p>
			</section>
		);
	}

	if (!data.invoice) {
		return (
			<section>
				<div>
					<p className="m-12">
						Sorry, but no invoice with this ID was found! Please click{' '}
						<Link
							to="/invoices"
							aria-label="invoices list"
							className="hover:underline"
						>
							Here
						</Link>{' '}
						to navigate back to your invoice list.
					</p>
				</div>
			</section>
		);
	}

	const {
		invoice,
		companies,
		customers,
		services,
		taxes,
		lastIncrementalInvoiceId,
	} = data;

	const invoiceServicesList = invoice.services.map(
		({ invoiceServiceId, serviceId, taxId, quantity }) => {
			const serviceRate =
				services.find((service) => service.serviceId === serviceId)?.rate || 0;
			const taxRate = taxes.find((tax) => tax.taxId === taxId)?.rate || 0;

			return {
				invoiceServiceId,
				serviceId,
				serviceRate,
				taxId,
				taxRate,
				quantity,
				intent: invoiceServiceIntents.update,
			};
		},
	);

	const handleInvoiceIdTypeChange = (identifierType: IdentifierType) => {
		let invoiceIdValue = '';
		if (identifierType === identifierTypes.incremental) {
			invoiceIdValue = String(lastIncrementalInvoiceId + 1);
		} else if (identifierType === identifierTypes.random) {
			invoiceIdValue = nanoid();
		}

		setInvoiceId(invoiceIdValue);
		resetErrors();
	};

	return (
		<section>
			<Form
				method="post"
				errors={errors?.nested}
				onClearErrors={resetErrors}
				onSubmit={handleSubmit}
			>
				<input type="hidden" name="invoice-id" value={invoice.invoiceId} />

				<div className="my-4 flex gap-3">
					<Select
						name="identifier-type"
						label="Invoice ID Type"
						defaultValue={invoice.identifierType}
						itemIdKey="id"
						items={identifierTypesList}
						onChange={(value) =>
							handleInvoiceIdTypeChange(value as IdentifierType)
						}
						errorMessage={errors?.nested?.['identifier-type']?.[0]}
					/>

					<FieldRoot name="identifier">
						<FieldLabel>Invoice ID</FieldLabel>
						<FieldControl value={invoiceId} readOnly />
						<FieldError />
					</FieldRoot>
				</div>

				<div className="my-4 flex gap-3">
					<Select
						name="locale"
						label="Language"
						defaultValue={invoice.locale}
						itemIdKey="id"
						items={localesList}
						onChange={resetErrors}
						errorMessage={errors?.nested?.['locale']?.[0]}
					/>

					<Combobox
						name="currency-country-code"
						label="Currency"
						defaultValue={invoice.currencyCountryCode}
						placeholder="Select a currency"
						itemIdKey="id"
						items={currencies}
						onChange={resetErrors}
						errorMessage={errors?.nested?.['currency-country-code']?.[0]}
					/>
				</div>

				<div className="my-4 flex gap-3">
					<FieldRoot name="date">
						<FieldLabel>Date</FieldLabel>
						<FieldControl type="date" defaultValue={invoice.date} />
						<FieldError />
					</FieldRoot>

					<FieldRoot name="due-date">
						<FieldLabel>Due date</FieldLabel>
						<FieldControl type="date" defaultValue={invoice.dueDate} />
						<FieldError />
					</FieldRoot>
				</div>

				<div className="my-4 flex gap-3">
					<Combobox
						name="company-id"
						label="Company"
						defaultValue={invoice.companyId}
						placeholder="Select a company"
						itemIdKey="companyId"
						items={companies}
						onChange={resetErrors}
						errorMessage={errors?.nested?.['company-id']?.[0]}
					/>

					<Combobox
						name="customer-id"
						label="Customer"
						defaultValue={invoice.customerId}
						placeholder="Select a customer"
						itemIdKey="customerId"
						items={customers}
						onChange={resetErrors}
						errorMessage={errors?.nested?.['customer-id']?.[0]}
					/>
				</div>

				<div className="my-4">
					<InvoiceServicesTable
						services={services}
						taxes={taxes}
						errors={errors?.nested}
						resetErrors={resetErrors}
						invoiceServicesList={invoiceServicesList}
					/>
				</div>

				<div className="my-4">
					<p>Note</p>
					<RichTextEditor name="note" initialValue={invoice.note} />
				</div>

				<div className="flex items-center gap-2">
					<Button disabled={isSubmitting}>Preview Invoice</Button>
					<Button disabled={isSubmitting}>Download Invoice</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isLoading ? 'Updating Invoice...' : 'Update Invoice'}
					</Button>
				</div>
			</Form>
		</section>
	);
}
