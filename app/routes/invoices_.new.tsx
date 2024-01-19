import * as React from 'react';
import { useFetcher } from '@remix-run/react';
import { nanoid } from 'nanoid';

import { Button, FormField } from '~/components/ui';
import { AddFormField, ModalPdfViewer } from '~/components';

import { intents, type Field, Intent } from '~/types';

export default function NewInvoiceRoute() {
	const fetcher = useFetcher<string>();
	const [fields, setFields] = React.useState<Field[]>([]);
	const [intent, setIntent] = React.useState<Intent | null>(null);

	const isLoading = fetcher.state !== 'idle';
	const pdfBase64 = isLoading ? null : fetcher.data;

	React.useEffect(() => {
		if (intent === intents.download && pdfBase64) {
			const link = document.createElement('a');
			link.href = pdfBase64;
			link.download = 'invoice.pdf';
			link.click();
		}
	}, [intent, pdfBase64]);

	return (
		<fetcher.Form action="/api/pdf" method="post">
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

			<div className="mt-32 flex gap-2">
				<ModalPdfViewer
					trigger={{
						text: 'Preview PDF',
						name: 'intent',
						value: intents.preview,
						type: 'submit',
						onClick: () => setIntent(intents.preview),
					}}
					pdfBase64={pdfBase64}
					isLoading={isLoading && intent === intents.preview}
				/>

				<Button
					type="submit"
					name="intent"
					value={intents.download}
					onClick={() => setIntent(intents.download)}
				>
					{isLoading && intent === intents.download
						? '...Loading PDF'
						: 'Download PDF'}
				</Button>

				<Button
					type="submit"
					name="intent"
					value={intents.save}
					onClick={() => setIntent(intents.save)}
				>
					{isLoading && intent === intents.save
						? '...Saving Invoice'
						: 'Save Invoice'}
				</Button>
			</div>
		</fetcher.Form>
	);
}
