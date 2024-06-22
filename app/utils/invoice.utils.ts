import { ulid } from 'ulid';
import { type z } from 'zod';
import type { IdType } from '~/lib/constants';
import { db } from '~/lib/db';
import type { NewInvoiceLoaderSchemaErrors } from '~/schemas/invoice.schemas';

export async function getInvoiceClientLoaderData() {
	const [companies, customers, services, invoice] = await Promise.all([
		db.companies.toArray(),
		db.customers.toArray(),
		db.services.toArray(),
		db.invoices.where({ invoiceIdType: 'incremental' as IdType }).last(), // TODO: should get the biggest number instead of the last one x)
	]);

	return {
		companies,
		customers,
		services,
		lastInvoiceId: invoice?.id ? Number(invoice.id) : 0,
	};
}

export function parseCreateInvoiceLoaderErrors(err: z.ZodError) {
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

	return error;
}

export function parseCreateInvoiceForm(formData: FormData) {
	console.log(Object.fromEntries(formData));

	const invoice = {
		id: ulid(),
		invoiceIdType: formData.get('invoice-id-type')?.toString(),
		invoiceId: formData.get('invoice-id')?.toString(),
		locale: formData.get('locale')?.toString(),
		countryCode: formData.get('country-code')?.toString(),
		invoiceDate: formData.get('invoice-data')?.toString(),
		dueDate: formData.get('due-date')?.toString(),
		// dateFormat: formData.get('invoice-id')?.toString(),
	};

	return {};
}
