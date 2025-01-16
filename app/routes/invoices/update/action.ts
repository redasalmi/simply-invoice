import { redirect } from 'react-router';
import { parseFormData } from '~/utils/parseForm.utils';
import { InvoiceFormSchema } from '~/routes/invoices/invoice.schemas';
import {
	updateInvoice,
	createInvoiceService,
	updateInvoiceService,
	deleteInvoiceService,
} from '~/routes/invoices/queries/invoice.queries';
import type { Route } from './+types/route';
import { invoiceServiceIntents } from '../components/InvoiceServicesTable';

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const { data, errors } = parseFormData(formData, InvoiceFormSchema);

	if (errors) {
		return {
			errors,
		};
	}

	await Promise.all([
		updateInvoice(data),
		data.services.map((invoiceService) => {
			if (invoiceService.intent === invoiceServiceIntents.create) {
				return createInvoiceService(invoiceService);
			}

			if (invoiceService.intent === invoiceServiceIntents.update) {
				return updateInvoiceService(invoiceService);
			}

			if (invoiceService.intent === invoiceServiceIntents.delete) {
				return deleteInvoiceService(invoiceService.invoiceServiceId);
			}
		}),
	]);

	return redirect('/invoices');
}
