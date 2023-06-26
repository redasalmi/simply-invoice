import { createSignal, Show, For } from 'solid-js';
import { createRouteAction } from 'solid-start';

import type { FormData } from 'undici';

type CompanyField = { key: string; value: string };

const initData: CompanyField = { key: '', value: '' };

export default function Home() {
	const [showAddCompany, setShowAddCompay] = createSignal(false);
	const [companyField, setCompanyField] = createSignal<CompanyField>(initData);
	const [companyData, setCompanyData] = createSignal<CompanyField[]>([]);

	const [{ pending }, { Form }] = createRouteAction(
		async (formData: FormData) => {
			const companyName = formData.get('company-name');
			const clientName = formData.get('client-name');

			console.log({ companyName, clientName });
		},
	);

	const toggleField = (event: MouseEvent, toggleShow: boolean) => {
		event.preventDefault();
		setShowAddCompay(toggleShow);

		if (!toggleShow) {
			setCompanyField(initData);
		}
	};

	const AddCompanyField = (event: MouseEvent) => {
		event.preventDefault();
		setCompanyData((data) => [...data, companyField()]);
		setShowAddCompay(false);
		setCompanyField(initData);
	};

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

					<For each={companyData()}>
						{(data) => {
							return (
								<div class="my-6">
									<label for={data.key}>{data.key}</label>
									<input
										type="text"
										id={data.key}
										name={data.key}
										value={data.value}
										readOnly
										class="block rounded-md border-2 border-gray-500 px-4 py-2"
									/>
								</div>
							);
						}}
					</For>

					<div class="my-6">
						<Show when={showAddCompany()}>
							<div class="my-6">
								<label for="company-field-title">Field Title:</label>
								<input
									type="text"
									id="company-field-title"
									name="company-field-title"
									value={companyField().key}
									onInput={(e) =>
										setCompanyField({
											...companyField(),
											key: e.currentTarget.value,
										})
									}
									class="block rounded-md border-2 border-gray-500 px-4 py-2"
								/>
							</div>

							<div class="my-6">
								<label for="company-field-value">Field Value:</label>
								<input
									type="text"
									id="company-field-value"
									name="company-field-value"
									value={companyField().value}
									onInput={(e) =>
										setCompanyField({
											...companyField(),
											value: e.currentTarget.value,
										})
									}
									class="block rounded-md border-2 border-gray-500 px-4 py-2"
								/>
							</div>

							<button
								type="button"
								class="my-6 rounded-md bg-blue-400 px-6 py-2"
								onClick={AddCompanyField}
							>
								Add New Company Field
							</button>
						</Show>

						<div>
							<Show
								when={showAddCompany()}
								fallback={
									<button
										type="button"
										class="rounded-md bg-blue-400 px-6 py-2"
										onClick={(event) => toggleField(event, true)}
									>
										Show New Company Field
									</button>
								}
							>
								<button
									type="button"
									class="rounded-md bg-blue-400 px-6 py-2"
									onClick={(event) => toggleField(event, false)}
								>
									Hide New Company Field
								</button>
							</Show>
						</div>
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
