import * as React from 'react';
import { useFetcher } from '@remix-run/react';
import { nanoid } from 'nanoid';

import { Button, FormField } from '~/components/ui';
import { AddFormField, ModalPdfViewer } from '~/components';

import type { Field } from '~/types';

const pdfFormId = 'pdf-form';

export default function NewInvoiceRoute() {
	const fetcher = useFetcher();
	const [pdfBase64, setPdfBase64] = React.useState('');
	const [fields, setFields] = React.useState<Field[]>([]);

	const getPdfBase64 = async () => {
		const resp = await fetch('/api/pdf', { method: 'POST' });
		const pdf = await resp.json();

		return pdf;
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const pdf = await getPdfBase64();
		const link = document.createElement('a');
		link.href = pdf;
		link.download = 'invoice.pdf';
		link.click();
	};

	const previewPdf = async () => {
		const pdf = await getPdfBase64();
		setPdfBase64(pdf);
	};

	return (
		<>
			<fetcher.Form onSubmit={handleSubmit} id={pdfFormId}>
				<h3 className="text-2xl">Customer Data</h3>
				<p className="block text-sm">fill all of your customer data below</p>

				<FormField name="customer-name" label="Name" className="my-2" />
				<FormField name="customer-email" label="Email" className="my-2" />
				<FormField name="customer-address" label="Address" className="my-2" />

				{fields.map(({ name, label, defaultValue }) => (
					<FormField
						key={nanoid()}
						name={name}
						label={label}
						defaultValue={defaultValue}
						className="my-2"
					/>
				))}

				<AddFormField fieldPrefix="customer" setFields={setFields} />
			</fetcher.Form>

			<div className="my-2">
				<ModalPdfViewer
					triggerText="Preview PDF"
					triggerOnClick={previewPdf}
					pdfBase64={pdfBase64}
					isLoading={fetcher.state === 'loading'}
				/>

				<Button form={pdfFormId} type="submit" className="ml-2">
					{fetcher.state === 'submitting' ? '...Loading PDF' : 'Download PDF'}
				</Button>
			</div>
		</>
	);
}
