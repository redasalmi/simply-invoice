import { createRouteAction } from 'solid-start';

import type { FormData } from 'undici';

export default function Home() {
	const [{ pending }, { Form }] = createRouteAction(
		async (formData: FormData) => {
			const companyName = formData.get('company-name');
			const clientName = formData.get('client-name');

			console.log({ companyName, clientName });
		},
	);

	return (
		<div class="m-8">
			<h1 class="text-4xl">Simply Invoice</h1>

			<Form>
				<div>
					<h3 class="text-2xl">Company Data</h3>

					<div class="my-6">
						<label for="company-name">Company name:</label>
						<input
							type="text"
							id="company-name"
							name="company-name"
							class="block rounded-md border-2 border-gray-500 px-4 py-2"
						/>
					</div>
				</div>

				<div>
					<h3 class="text-2xl">Client Data</h3>

					<div class="my-6">
						<label for="client-name">Client Name:</label>
						<input
							type="text"
							id="client-name"
							name="client-name"
							class="block rounded-md border-2 border-gray-500 px-4 py-2"
						/>
					</div>
				</div>

				<div class="my-6">
					<button
						type="submit"
						disabled={pending}
						class="rounded-md bg-blue-400 px-6 py-2"
					>
						Submit
					</button>
				</div>
			</Form>
		</div>
	);
}
