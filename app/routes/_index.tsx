import * as React from 'react';
import { useFetcher } from '@remix-run/react';
import { nanoid } from 'nanoid';

import { FormField, Button, AddFormField } from '~/components';

import type { Field } from '~/types';

const pdfFormId = 'pdf-form';

export default function Home() {
	const fetcher = useFetcher();
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

	return (
		<main className="container mx-auto">
			<h1 className="text-4xl">Simply Invoice</h1>

			<fetcher.Form action="/pdf" method="GET" id={pdfFormId}>
				<h3 className="mt-6 text-2xl">Company Data</h3>

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
				<Button
					form={pdfFormId}
					type="submit"
					text={
						fetcher.state === 'submitting' ? '...Loading PDF' : 'Download PDF'
					}
				/>
			</div>
		</main>
	);
}
