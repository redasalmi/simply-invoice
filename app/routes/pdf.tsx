import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { renderToStream } from '@react-pdf/renderer';

import { PdfDocument } from '~/components';

import type { LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async () => {
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

export default function Pdf() {
	const data = useLoaderData();

	return (
		<main className="container mx-auto">
			<h1 className="text-4xl">PDF Viewer/Generator</h1>

			<iframe src={`${data}#toolbar=0&navpanes=0`} />
		</main>
	);
}
