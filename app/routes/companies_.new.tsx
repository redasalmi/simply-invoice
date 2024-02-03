import * as React from 'react';
import { redirect, useFetcher } from '@remix-run/react';
import queryString from 'query-string';
import { nanoid } from 'nanoid';
import localforage from 'localforage';
import { Reorder } from 'framer-motion';

import { AddFormField, FormField, UncontrolledFormField } from '~/components';
import { Button } from '~/components/ui';
import { companiesKey } from '~/constants';

import type { ClientActionFunctionArgs } from '@remix-run/react';
import type { Company, Field } from '~/types';

export async function clientAction({ request }: ClientActionFunctionArgs) {
	const formQueryString = await request.text();
	const formData = queryString.parse(formQueryString, { sort: false });

	const newCompany: Company = {
		id: nanoid(),
		name: formData['name']?.toString(),
		email: formData['email']?.toString(),
		address: {
			address1: formData['address1']?.toString(),
			address2: formData['address2']?.toString(),
			city: formData['city']?.toString(),
			country: formData['country']?.toString(),
			province: formData['province']?.toString(),
			zip: formData['zip']?.toString(),
		},
		custom: [],
	};

	for (const [key, value] of Object.entries(formData)) {
		if (key.search('company-custom') > -1 && value) {
			const label = key
				.replace('company-custom[', '')
				.replaceAll('-', ' ')
				.replace(']', '');

			if (Array.isArray(value) && value[0]) {
				newCompany.custom.push({
					label,
					value: value[0].trim(),
					showLabel: value[1] === 'on',
				});
			} else if (typeof value === 'string' && value) {
				newCompany.custom.push({
					label,
					value: value.trim(),
				});
			}
		}
	}

	const companies = await localforage.getItem<Array<Company>>(companiesKey);
	await localforage.setItem<Array<Company>>(
		companiesKey,
		(companies || []).concat(newCompany),
	);

	return redirect('/companies');
}

const companyFields: Array<Pick<Field, 'key' | 'name' | 'label'>> = [
	{
		key: nanoid(),
		name: 'name',
		label: 'Name',
	},
	{
		key: nanoid(),
		name: 'email',
		label: 'Email',
	},
];

const addressFields: Array<Pick<Field, 'key' | 'name' | 'label'>> = [
	{
		key: nanoid(),
		name: 'address1',
		label: 'Address 1',
	},
	{
		key: nanoid(),
		name: 'address2',
		label: 'Address 2',
	},
	{
		key: nanoid(),
		name: 'country',
		label: 'Country',
	},
	{
		key: nanoid(),
		name: 'province',
		label: 'Province',
	},
	{
		key: nanoid(),
		name: 'city',
		label: 'City',
	},
	{
		key: nanoid(),
		name: 'zip',
		label: 'Zip',
	},
];

export default function NewCompanyRoute() {
	const fetcher = useFetcher<typeof clientAction>();
	const isLoading = fetcher.state !== 'idle';

	const [formFields, setFormFields] = React.useState<Array<Field>>([]);

	const addFormField = (field: Field) => {
		setFormFields(formFields.concat(field));
	};

	const onFormFieldChange = (formField: Field, fieldIndex: number) => {
		setFormFields(Object.assign([], formFields, { [fieldIndex]: formField }));
	};

	const removeFormField = (fieldIndex: number) => {
		setFormFields(
			formFields.slice(0, fieldIndex).concat(formFields.slice(fieldIndex + 1)),
		);
	};

	return (
		<section>
			<fetcher.Form method="post">
				<div>
					{companyFields.map((field) => (
						<UncontrolledFormField
							key={field.key}
							className="my-2"
							formField={field}
						/>
					))}
				</div>

				<div>
					<h3 className="text-2xl">Address</h3>

					<div>
						{addressFields.map((field) => (
							<UncontrolledFormField
								key={field.key}
								className="my-2"
								formField={field}
							/>
						))}
					</div>
				</div>

				<AddFormField fieldNamePrefix="company" addFormField={addFormField}>
					<h3 className="text-2xl">Custom fields</h3>
					<p className="mb-2 block text-sm">
						Add any custom fields and order them
					</p>

					{formFields.length ? (
						<Reorder.Group values={formFields} onReorder={setFormFields}>
							{formFields.map((formField, index) => (
								<Reorder.Item key={formField.key} value={formField}>
									<FormField
										key={formField.key}
										formField={formField}
										className="my-2"
										onFormFieldChange={(updatedFormField) =>
											onFormFieldChange(updatedFormField, index)
										}
										removeFormField={() => removeFormField(index)}
									/>
								</Reorder.Item>
							))}
						</Reorder.Group>
					) : null}
				</AddFormField>

				<div>
					<Button type="submit">
						{isLoading ? '...Saving Company' : 'Save Company'}
					</Button>
				</div>
			</fetcher.Form>
		</section>
	);
}
