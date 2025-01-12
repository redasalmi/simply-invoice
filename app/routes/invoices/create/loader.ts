import * as v from 'valibot';
import { getAllCompanies } from '~/routes/companies/queries/company.queries';
import { getAllCustomers } from '~/routes/customers/queries/customer.queries';
import { getLastIncrementalInvoiceId } from '~/routes/invoices/queries/invoice.queries';
import { getAllServices } from '~/routes/services/queries/service.queries';
import { getAllTaxes } from '~/routes/taxes/queries/tax.queries';
import { CreateInvoiceLoaderSchema } from '~/routes/invoices/invoice.schemas';

export async function clientLoader() {
	const [companies, customers, services, taxes, lastIncrementalInvoiceId] =
		await Promise.all([
			getAllCompanies(),
			getAllCustomers(),
			getAllServices(),
			getAllTaxes(),
			getLastIncrementalInvoiceId(),
		]);

	const data = v.safeParse(
		CreateInvoiceLoaderSchema,
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

	return {
		data: data.output,
		errors: null,
	};
}
