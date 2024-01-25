import { renderToStream } from '@react-pdf/renderer';
import { json, redirect } from '@remix-run/node';
import queryString from 'query-string';

import { type PdfEntry, PdfDocument } from '~/components';
import { intents } from '~/types';

import type { ActionFunctionArgs } from '@remix-run/node';

export async function action({ request }: ActionFunctionArgs) {
	const formQueryString = await request.text();
	const formData = queryString.parse(formQueryString, { sort: false });
	const intent = formData.intent;

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

	const stream = await renderToStream(<PdfDocument data={{ customer }} />);

	const body: Buffer = await new Promise((resolve, reject) => {
		const buffers: Uint8Array[] = [];
		stream.on('data', (data) => {
			buffers.push(data);
		});
		stream.on('end', () => {
			resolve(Buffer.concat(buffers));
		});
		stream.on('error', reject);
	});

	if (intent === intents.save) {
		return redirect('/invoices');
	}

	return json(`data:application/pdf;base64,${body.toString('base64')}`);
}
