import { useFetcher } from '@remix-run/react';

import { FormField, Button } from '~/components';

export default function Home() {
	const fetcher = useFetcher();

	return (
		<main className="container mx-auto">
			<h1 className="text-4xl">Simply Invoice</h1>

			<fetcher.Form action="/pdf" method="POST">
				<h3 className="mt-6 text-2xl">Company Data</h3>

				<FormField
					id="company-name"
					name="company-name"
					label="Name"
					className="my-1"
				/>
				<FormField
					id="company-address"
					name="company-address"
					label="Address"
					className="my-1"
				/>

				<div className="my-2">
					<Button text="Submit" type="submit" />
				</div>
			</fetcher.Form>
		</main>
	);
}
