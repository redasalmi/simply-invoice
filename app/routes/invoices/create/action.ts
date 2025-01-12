import { redirect } from 'react-router';
import { parseFormData } from '~/utils/parseForm.utils';
import { InvoiceFormSchema } from '~/routes/invoices/invoice.schemas';
import {
	createInvoice,
	createInvoiceService,
} from '~/routes/invoices/queries/invoice.queries';
import type { Route } from './+types/route';

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const { data, errors } = parseFormData(formData, InvoiceFormSchema);

	if (errors) {
		return {
			errors,
		};
	}

	await createInvoice(data);
	await Promise.all(
		data.services.map((invoiceService) => createInvoiceService(invoiceService)),
	);

	return redirect('/invoices');
}
