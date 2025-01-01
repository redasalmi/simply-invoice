import * as v from 'valibot';
import { getAllCompanies } from '~/queries/company.queries';
import { getAllCustomers } from '~/queries/customer.queries';
import { getLastIncrementalInvoiceId } from '~/queries/invoice.queries';
import { getAllServices } from '~/queries/service.queries';
import { getAllTaxes } from '~/queries/tax.queries';
import { NewInvoiceLoaderSchema } from '~/schemas/invoice.schemas';

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
		NewInvoiceLoaderSchema,
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
