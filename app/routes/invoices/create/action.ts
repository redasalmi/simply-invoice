import { redirect } from 'react-router';
import { parseFormData } from '~/utils/parseForm.utils';
import { InvoiceFormSchema } from '~/schemas/invoice.schemas';
import type { Route } from './+types/route';

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();

	const { data, errors } = parseFormData(formData, InvoiceFormSchema);

	if (errors) {
		return {
			errors,
		};
	}

	return redirect('/invoices');
}
