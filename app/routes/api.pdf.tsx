import { renderToStream } from '@react-pdf/renderer';
import { json } from '@remix-run/node';

import { PdfDocument } from '~/components';

import type { ActionFunction } from '@remix-run/node';

export const action: ActionFunction = async () => {
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

	return json(`data:application/pdf;base64,${body.toString('base64')}`);
};
