import * as React from 'react';
import { useFetcher } from '@remix-run/react';
import { nanoid } from 'nanoid';

import { FormField, Button, AddFormField, ModalPdfViewer } from '~/components';

import type { Field } from '~/types';

const pdfFormId = 'pdf-form';

export default function NewInvoiceRoute() {
	const fetcher = useFetcher();
	const [pdfBase64, setPdfBase64] = React.useState('');
	const [fields, setFields] = React.useState<Field[]>([]);

	React.useEffect(() => {
		if (fetcher.state === 'idle' && fetcher.data) {
			const link = document.createElement('a');
			const fileName = 'invoice.pdf';
			link.href = fetcher.data;
			link.download = fileName;
			link.click();
		}
	}, [fetcher.state, fetcher.data]);

	const getPdfBase64 = async () => {
		const resp = await fetch('/api/pdf', { method: 'POST' });
		const pdf = await resp.json();
		setPdfBase64(pdf);
	};

	return (
		<>
			<fetcher.Form action="/api/pdf" method="POST" id={pdfFormId}>
				<h3 className="text-2xl">Company Data</h3>

				<FormField name="company-name" label="Name" className="my-1" />
				<FormField name="company-address" label="Address" className="my-1" />

				{fields.map(({ name, label, defaultValue }) => (
					<FormField
						key={nanoid()}
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
					triggerOnClick={getPdfBase64}
					hasCloseBtn={false}
					pdfBase64={pdfBase64}
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
