import * as React from 'react';
import { redirect, useFetcher } from '@remix-run/react';
import queryString from 'query-string';
import { nanoid } from 'nanoid';
import { Reorder } from 'framer-motion';

import { AddFormField, FormField, UncontrolledFormField } from '~/components';
import { Button } from '~/components/ui';
import { customersStore } from '~/lib/stores';

import type { ClientActionFunctionArgs } from '@remix-run/react';
import type { Customer, Field } from '~/types';

export async function clientAction({ request }: ClientActionFunctionArgs) {
	const formQueryString = await request.text();
	const formData = queryString.parse(formQueryString, { sort: false });

	const customerId = nanoid();
	const newCustomer: Customer = {
		id: customerId,
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
		if (key.search('customer-custom') > -1 && value) {
			const label = key
				.replace('customer-custom[', '')
				.replaceAll('-', ' ')
				.replace(']', '');

			if (Array.isArray(value) && value[0]) {
				newCustomer.custom.push({
					label,
					value: value[0].trim(),
					showLabel: value[1] === 'on',
				});
			} else if (typeof value === 'string' && value) {
				newCustomer.custom.push({
					label,
					value: value.trim(),
				});
			}
		}
	}

	await customersStore.setItem<Customer>(customerId, newCustomer);

	return redirect('/customers');
}

const customerFields: Array<Pick<Field, 'key' | 'name' | 'label'>> = [
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

export default function NewCustomerRoute() {
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
					{customerFields.map((field) => (
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

				<AddFormField fieldNamePrefix="customer" addFormField={addFormField}>
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
						{isLoading ? '...Saving Customer' : 'Save Customer'}
					</Button>
				</div>
			</fetcher.Form>
		</section>
	);
}
