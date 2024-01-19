import { renderToStream } from '@react-pdf/renderer';
import { json, redirect } from '@remix-run/node';

import { PdfDocument } from '~/components';
import { intents } from '~/types';

import type { ActionFunctionArgs } from '@remix-run/node';

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const intent = formData.get('intent')?.toString();

	const stream = await renderToStream(<PdfDocument />);

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
};
