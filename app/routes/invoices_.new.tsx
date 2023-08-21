import * as React from 'react';
import { useFetcher } from '@remix-run/react';
import { v4 as uuidv4 } from 'uuid';

import { FormField, Button, AddFormField, ModalPdfViewer } from '~/components';

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
				<h3 className="text-2xl">Company Data</h3>
				<FormField name="company-name" label="Name" className="my-1" />
				<FormField name="company-address" label="Address" className="my-1" />

				{fields.map(({ name, label, defaultValue }) => (
					<FormField
						key={uuidv4()}
						name={name}
						label={label}
						defaultValue={defaultValue}
						className="my-1"
					/>
				))}
			</fetcher.Form>

			<div className="my-2">
				<AddFormField fieldPrefix="company" setFields={setFields} />
			</div>

			<div className="my-2">
				<ModalPdfViewer
					triggerText="Preview PDF"
					triggerOnClick={previewPdf}
					hasCloseBtn={false}
					pdfBase64={pdfBase64}
					isLoading={fetcher.state === 'loading'}
				/>

				<Button
					form={pdfFormId}
					type="submit"
					className="ml-4"
					text={
						fetcher.state === 'submitting' ? '...Loading PDF' : 'Download PDF'
					}
				/>
			</div>
		</>
	);
}
