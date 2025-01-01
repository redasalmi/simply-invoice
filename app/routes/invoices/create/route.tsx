import * as React from 'react';
import { nanoid } from 'nanoid';
import {
	identifierTypes,
	identifierTypesList,
	intents,
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
import type { Route } from './+types/route';

export { clientLoader } from './loader';

export default function InvoiceCreateRoute({
	loaderData,
}: Route.ComponentProps) {
	const { data, errors } = loaderData;

	const [invoiceId, setInvoiceId] = React.useState(
		String((data?.lastIncrementalInvoiceId || 0) + 1),
	);

	if (errors?.nested) {
		const errorsList = Object.values(errors.nested).flat();

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

	const { companies, customers, services, taxes, lastIncrementalInvoiceId } =
		data;
	console.log({
		loaderData,
	});

	const handleInvoiceIdTypeChange = (identifierType: IdentifierType) => {
		let invoiceIdValue = '';
		if (identifierType === identifierTypes.incremental) {
			invoiceIdValue = String(lastIncrementalInvoiceId + 1);
		} else if (identifierType === identifierTypes.random) {
			invoiceIdValue = nanoid();
		}

		setInvoiceId(invoiceIdValue);
	};

	return (
		<section>
			<Form method="post">
				<div className="my-4 flex gap-3">
					<Select
						name="identifier-type"
						label="Invoice Identifier Type"
						itemIdKey="id"
						items={identifierTypesList}
						onChange={(value) =>
							handleInvoiceIdTypeChange(value as IdentifierType)
						}
					/>

					<FieldRoot name="identifier">
						<FieldLabel>Invoice Identifier</FieldLabel>
						<FieldControl value={invoiceId} readOnly />
						<FieldError />
					</FieldRoot>
				</div>

				<div className="my-4 flex gap-3">
					<Select
						name="locale"
						label="Invoice Language"
						itemIdKey="id"
						items={localesList}
					/>

					<Combobox
						name="country-code"
						label="Currency"
						placeholder="Select a currency"
						itemIdKey="id"
						items={currencies}
					/>
				</div>

				<div className="my-4 flex gap-3">
					<FieldRoot name="date">
						<FieldLabel>Invoice date</FieldLabel>
						<FieldControl type="date" />
						<FieldError />
					</FieldRoot>

					<FieldRoot name="due-date">
						<FieldLabel>Invoice due date</FieldLabel>
						<FieldControl type="date" />
						<FieldError />
					</FieldRoot>
				</div>

				<div className="my-4 flex gap-3">
					<Combobox
						name="company-id"
						label="Company"
						placeholder="Select a company"
						itemIdKey="companyId"
						items={companies}
					/>

					<Combobox
						name="customer-id"
						label="Customer"
						placeholder="Select a customer"
						itemIdKey="customerId"
						items={customers}
					/>
				</div>

				{/* <div className="my-4">
          TODO: maybe add a service-order field to save the services order
          <ServicesTable services={services} />
        </div> */}

				<div className="my-4">
					<p>Note</p>
					<RichTextEditor name="note" />
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
