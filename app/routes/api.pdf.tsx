import { redirect } from '@remix-run/node';
import queryString from 'query-string';

import { type PdfEntry } from '~/components';

import type { ActionFunctionArgs } from '@remix-run/node';

export async function action({ request }: ActionFunctionArgs) {
	const formQueryString = await request.text();
	const formData = queryString.parse(formQueryString, { sort: false });

	const customer: Record<string, PdfEntry> = {};
	for (const [key, value] of Object.entries(formData)) {
		if (key.search('customer-') > -1 && value) {
			const field = key.replace('customer-', '').replace('[]', '');

			if (Array.isArray(value) && value[0]) {
				customer[field] = {
					value: value[0].trim(),
					showTitle: value[1] === 'on',
				};
			} else if (typeof value === 'string' && value) {
				customer[field] = {
					value: value.trim(),
				};
			}
		}
	}

	return redirect('/invoices');
}
