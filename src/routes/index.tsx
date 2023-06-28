import { createSignal } from 'solid-js';
import { createRouteAction } from 'solid-start';

import InputField from '~/components/InputField';
import FieldList from '~/components/FieldList';
import AddField from '~/components/AddField';
import Button from '~/components/Button';

import type { FormData } from 'undici';
import type { Field } from '~/components/AddField';

export default function Home() {
	const [companyFields, setCompanyFields] = createSignal<Field[]>([]);

	const [{ pending }, { Form }] = createRouteAction(
		async (formData: FormData) => {
			for (const field of formData.entries()) {
				console.log({ field });
			}
		},
	);

	return (
		<div class="m-8">
			<h1 class="text-4xl">Simply Invoice</h1>

			<Form>
				<h3 class="mt-6 text-2xl">Company Data</h3>

				<InputField id="company-name" label="Name" />
				<InputField id="company-address" label="Address" />
				<FieldList fields={companyFields()} />
				<AddField fieldPrefix="company" setFields={setCompanyFields} />

				<div class="my-6">
					<Button text="Submit" type="submit" disabled={pending} />
				</div>
			</Form>
		</div>
	);
}
