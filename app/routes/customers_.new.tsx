import * as React from 'react';
import { Form, redirect, useNavigation } from '@remix-run/react';
import queryString from 'query-string';
import { nanoid } from 'nanoid';
import { Reorder } from 'framer-motion';

import { AddFormField, FormField, UncontrolledFormField } from '~/components';
import { Button } from '~/components/ui';
import { customersStore } from '~/lib/stores';

import type { ClientActionFunctionArgs } from '@remix-run/react';
import type { Customer, Field, CustomField } from '~/types';

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
	};

	const customFields: Record<string, CustomField> = {};
	for (const [key, value] of Object.entries(formData)) {
		if (key.search('custom-') !== -1) {
			const id = key
				.replace('custom-', '')
				.replace('show-label-', '')
				.replace('label-', '')
				.replace('content-', '');

			if (!customFields[id]) {
				customFields[id] = {
					id,
				};
			}

			if (key.search('show-label-') !== -1) {
				customFields[id].showLabel = value === 'on';
			} else if (key.search('label-') !== -1) {
				customFields[id].label = value;
			} else if (key.search('content-') !== -1) {
				customFields[id].content = value;
			}
		}
	}

	const customFieldsValues = Object.values(customFields);
	if (customFieldsValues.length) {
		newCustomer.custom = customFieldsValues;
	}

	await customersStore.setItem<Customer>(customerId, newCustomer);

	return redirect('/customers');
}

const customerFields: Array<Field> = [
	{
		id: nanoid(),
		name: 'name',
		label: 'Name',
	},
	{
		id: nanoid(),
		name: 'email',
		label: 'Email',
	},
];

const addressFields: Array<Field> = [
	{
		id: nanoid(),
		name: 'address1',
		label: 'Address 1',
	},
	{
		id: nanoid(),
		name: 'address2',
		label: 'Address 2',
	},
	{
		id: nanoid(),
		name: 'country',
		label: 'Country',
	},
	{
		id: nanoid(),
		name: 'province',
		label: 'Province',
	},
	{
		id: nanoid(),
		name: 'city',
		label: 'City',
	},
	{
		id: nanoid(),
		name: 'zip',
		label: 'Zip',
	},
];

export default function NewCustomerRoute() {
	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';

	const [formFields, setFormFields] = React.useState<Array<CustomField>>([]);

	const addFormField = (field: CustomField) => {
		setFormFields(formFields.concat(field));
	};

	const onFormFieldChange = (formField: CustomField, fieldIndex: number) => {
		setFormFields(Object.assign([], formFields, { [fieldIndex]: formField }));
	};

	const removeFormField = (fieldIndex: number) => {
		setFormFields(
			formFields.slice(0, fieldIndex).concat(formFields.slice(fieldIndex + 1)),
		);
	};

	return (
		<section>
			<Form method="post">
				<div>
					{customerFields.map((field) => (
						<UncontrolledFormField
							key={field.id}
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
								key={field.id}
								className="my-2"
								formField={field}
							/>
						))}
					</div>
				</div>

				<AddFormField addFormField={addFormField}>
					<h3 className="text-2xl">Custom fields</h3>
					<p className="mb-2 block text-sm">
						Add any custom fields and order them
					</p>

					{formFields.length ? (
						<Reorder.Group values={formFields} onReorder={setFormFields}>
							{formFields.map((formField, index) => (
								<Reorder.Item key={formField.id} value={formField}>
									<FormField
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
			</Form>
		</section>
	);
}
