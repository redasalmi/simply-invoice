import { createSignal, Show } from 'solid-js';
import { createRouteAction } from 'solid-start';

import InputField from '~/components/InputField';
import Button from '~/components/Button';
import FieldList from '~/components/FieldList';

import type { FormData } from 'undici';

export type Field = { key: string; value: string };

const initData: Field = { key: '', value: '' };

export default function Home() {
	const [showAddCompany, setShowAddCompay] = createSignal(false);
	const [companyField, setCompanyField] = createSignal<Field>(initData);
	const [companyData, setCompanyData] = createSignal<Field[]>([]);

	const [{ pending }, { Form }] = createRouteAction(
		async (formData: FormData) => {
			const companyName = formData.get('company-name');
			const clientName = formData.get('client-name');

			console.log({ companyName, clientName });
		},
	);

	const toggleCompanyField = (toggleShow: boolean) => {
		setShowAddCompay(toggleShow);

		if (!toggleShow) {
			setCompanyField(initData);
		}
	};

	const handleOnInput = (key: string, value: string) => {
		setCompanyField({
			...companyField(),
			[key]: value,
		});
	};

	const AddCompanyField = () => {
		setCompanyData((data) => [...data, companyField()]);
		setShowAddCompay(false);
		setCompanyField(initData);
	};

	return (
		<div class="m-8">
			<h1 class="text-4xl">Simply Invoice</h1>

			<Form>
				<h3 class="text-2xl">Company Data</h3>

				<InputField id="company-name" label="Company Name" />
				<FieldList fields={companyData()} />

				<div class="my-6">
					<Show when={showAddCompany()}>
						<InputField
							id="company-field-title"
							label="Field Title"
							value={companyField().key}
							handleOnInput={(value) => handleOnInput('key', value)}
						/>

						<InputField
							id="company-field-value"
							label="Field Value"
							value={companyField().value}
							handleOnInput={(value) => handleOnInput('value', value)}
						/>

						<Button text="Add New Company Field" onClick={AddCompanyField} />
					</Show>

					<div>
						<Show
							when={showAddCompany()}
							fallback={
								<Button
									text="Show New Company Field"
									onClick={() => toggleCompanyField(true)}
								/>
							}
						>
							<Button
								text="Hide New Company Field"
								onClick={() => toggleCompanyField(false)}
							/>
						</Show>
					</div>
				</div>
			</Form>
		</div>
	);
}
