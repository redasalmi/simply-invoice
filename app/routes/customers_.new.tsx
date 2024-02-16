import * as React from 'react';

import { Form, redirect, useActionData, useNavigation } from '@remix-run/react';
import type { ClientActionFunctionArgs } from '@remix-run/react';
import { Reorder } from 'framer-motion';
import { nanoid } from 'nanoid';
import queryString from 'query-string';
import { z } from 'zod';

import { AddFormField, FormField, UncontrolledFormField } from '~/components';
import { Button } from '~/components/ui';

import { customerSchema } from '~/lib/schemas';
import type { CustomerSchemaErrors } from '~/lib/schemas';
import { customersStore } from '~/lib/stores';
import type { Customer, CustomField, Field } from '~/lib/types';

type ActionErrors = {
	name?: string;
	email?: string;
	address1?: string;
	country?: string;
	custom?: Record<string, { label?: string; content?: string }>;
};

export async function clientAction({ request }: ClientActionFunctionArgs) {
	try {
		const formQueryString = await request.text();
		const formData = queryString.parse(formQueryString, { sort: false });

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

				if (key === `custom-label-${id}`) {
					customFields[id].label = value;
				} else if (key === `custom-content-${id}`) {
					customFields[id].content = value;
				} else if (key === `custom-show-label-${id}`) {
					customFields[id].showLabel = value === 'on';
				}
			}
		}

		const newCustomer = customerSchema.parse({
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
			...(Object.keys(customFields).length
				? { custom: Object.values(customFields) }
				: undefined),
		});
		await customersStore.setItem<Customer>(newCustomer.id, newCustomer);

		return redirect('/customers');
	} catch (err) {
		if (err instanceof z.ZodError) {
			const zodErrors: CustomerSchemaErrors = err.format();
			const customErrors: Record<string, { label?: string; content?: string }> =
				{};

			if (zodErrors.custom) {
				for (const [key, value] of Object.entries(zodErrors.custom)) {
					if (key === '_errors') {
						continue;
					}

					customErrors[key] = {};
					if (value?.label?._errors?.[0]) {
						customErrors[key].label = value?.label?._errors?.[0];
					}

					if (value?.content?._errors?.[0]) {
						customErrors[key].content = value?.content?._errors?.[0];
					}
				}
			}

			const errors: ActionErrors = {};
			if (zodErrors.name?._errors?.[0]) {
				errors.name = zodErrors.name._errors[0];
			}
			if (zodErrors.email?._errors?.[0]) {
				errors.email = zodErrors.email._errors[0];
			}
			if (zodErrors.address?.address1?._errors?.[0]) {
				errors.address1 = zodErrors.address.address1._errors[0];
			}
			if (zodErrors.address?.country?._errors?.[0]) {
				errors.country = zodErrors.address.country._errors[0];
			}
			if (Object.keys(customErrors).length) {
				errors.custom = customErrors;
			}

			return {
				errors,
			};
		}
	}
}

const customerFields: Array<Field> = [
	{
		id: nanoid(),
		name: 'name',
		label: 'Name *',
		input: {
			required: true,
		},
	},
	{
		id: nanoid(),
		name: 'email',
		label: 'Email *',
		input: {
			type: 'email',
			required: true,
		},
	},
];

const addressFields: Array<Field> = [
	{
		id: nanoid(),
		name: 'address1',
		label: 'Address 1',
		input: {
			required: true,
		},
	},
	{
		id: nanoid(),
		name: 'address2',
		label: 'Address 2',
	},
	{
		id: nanoid(),
		name: 'country',
		label: 'Country *',
		input: {
			required: true,
		},
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
	const actionData = useActionData<typeof clientAction>();
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
							formField={{
								...field,
								error: actionData?.errors?.[field.name],
							}}
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
								formField={{
									...field,
									error: actionData?.errors?.[field.name],
								}}
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
										formField={{
											...formField,
											labelError: actionData?.errors?.custom?.[index]?.label,
											contentError:
												actionData?.errors?.custom?.[index]?.content,
										}}
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
