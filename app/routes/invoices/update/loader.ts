import * as v from 'valibot';
import { getAllCompanies } from '~/routes/companies/queries/company.queries';
import { getAllCustomers } from '~/routes/customers/queries/customer.queries';
import {
	getInvoice,
	getLastIncrementalInvoiceId,
} from '~/routes/invoices/queries/invoice.queries';
import { getAllServices } from '~/routes/services/queries/service.queries';
import { getAllTaxes } from '~/routes/taxes/queries/tax.queries';
import { InvoiceLoaderSchema } from '~/routes/invoices/invoice.schemas';
import type { Route } from './+types/route';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const [companies, customers, services, taxes, lastIncrementalInvoiceId] =
		await Promise.all([
			getAllCompanies(),
			getAllCustomers(),
			getAllServices(),
			getAllTaxes(),
			getLastIncrementalInvoiceId(),
		]);

	const data = v.safeParse(
		InvoiceLoaderSchema,
		{
			companies,
			customers,
			services,
			taxes,
			lastIncrementalInvoiceId,
		},
		{ abortPipeEarly: true },
	);

	if (data.issues) {
		return {
			data: null,
			errors: v.flatten(data.issues),
		};
	}

	const invoiceId = params.id;
	const invoice = await getInvoice(invoiceId);

	return {
		data: Object.assign({}, data.output, { invoice }),
		errors: null,
	};
}
