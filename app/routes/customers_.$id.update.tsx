import * as React from 'react';

import {
	Form,
	Link,
	redirect,
	useActionData,
	useLoaderData,
	useNavigation,
} from '@remix-run/react';
import type {
	ClientActionFunctionArgs,
	ClientLoaderFunctionArgs,
} from '@remix-run/react';
import { Reorder } from 'framer-motion';
import { nanoid } from 'nanoid';
import queryString from 'query-string';
import invariant from 'tiny-invariant';
import { z } from 'zod';

import { AddFormField, FormField, UncontrolledFormField } from '~/components';
import { Button } from '~/components/ui';

import { customerSchema } from '~/lib/schemas';
import type { CustomerSchemaErrors } from '~/lib/schemas';
import { db } from '~/lib/stores';
import type { CustomField, Field } from '~/lib/types';

type ActionErrors = {
	name?: string;
	email?: string;
	address1?: string;
	country?: string;
	custom?: Record<string, { label?: string; content?: string }>;
};

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
	invariant(params.id, 'Customer ID is required');
	const customerId = params.id;

	return {
		customer: await db.customers.get(customerId),
	};
}

export async function clientAction({
	params,
	request,
}: ClientActionFunctionArgs) {
	invariant(params.id, 'Customer ID is required');

	try {
		const customerId = params.id;
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

		const updatedCustomer = customerSchema.parse({
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
			...(Object.keys(customFields).length
				? { custom: Object.values(customFields) }
				: undefined),
		});
		await db.customers.update(updatedCustomer.id, updatedCustomer);

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

const nameId = nanoid();
const emailId = nanoid();
const address1Id = nanoid();
const address2Id = nanoid();
const countryId = nanoid();
const provinceId = nanoid();
const cityId = nanoid();
const zipId = nanoid();

export default function CustomerUpdateRoute() {
	const { customer } = useLoaderData<typeof clientLoader>();
	const actionData = useActionData<typeof clientAction>();
	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';

	const [formFields, setFormFields] = React.useState<Array<CustomField>>([]);

	React.useEffect(() => {
		const customFields: Array<CustomField> =
			customer?.custom?.map((field, index) => ({
				id: field.id,
				label: field.label,
				content: field.content,
				showLabel: field.showLabel,
				labelError: actionData?.errors.custom?.[index]?.label,
				contentError: actionData?.errors.custom?.[index]?.content,
			})) || [];
		setFormFields(customFields);
	}, [actionData?.errors.custom, customer?.custom]);

	if (!customer) {
		return (
			<section>
				<div>
					<p className="m-12">
						Sorry, but no customer with this ID was found! Please click{' '}
						<Link
							to="/customers"
							aria-label="customers list"
							className="hover:underline"
						>
							Here
						</Link>{' '}
						to navigate back to your customers list.
					</p>
				</div>
			</section>
		);
	}

	const customerFields: Array<Field> = [
		{
			id: nameId,
			name: 'name',
			label: 'Name *',
			input: {
				required: true,
				defaultValue: customer.name,
			},
			error: actionData?.errors.name,
		},
		{
			id: emailId,
			name: 'email',
			label: 'Email *',
			input: {
				type: 'email',
				required: true,
				defaultValue: customer.email,
			},
			error: actionData?.errors.email,
		},
	];

	const addressFields: Array<Field> = [
		{
			id: address1Id,
			name: 'address1',
			label: 'Address 1 *',
			input: {
				required: true,
				defaultValue: customer.address.address1,
			},
			error: actionData?.errors.address1,
		},
		{
			id: address2Id,
			name: 'address2',
			label: 'Address 2',
			input: {
				defaultValue: customer.address.address2,
			},
		},
		{
			id: countryId,
			name: 'country',
			label: 'Country *',
			input: {
				required: true,
				defaultValue: customer.address.country,
			},
			error: actionData?.errors.country,
		},
		{
			id: provinceId,
			name: 'province',
			label: 'Province',
			input: {
				defaultValue: customer.address.province,
			},
		},
		{
			id: cityId,
			name: 'city',
			label: 'City',
			input: {
				defaultValue: customer.address.city,
			},
		},
		{
			id: zipId,
			name: 'zip',
			label: 'Zip',
			input: {
				defaultValue: customer.address.zip,
			},
		},
	];

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
					<h3 className="text-2xl">Custom Fields</h3>
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
						{isLoading ? '...Updating Customer' : 'Update Customer'}
					</Button>
				</div>
			</Form>
		</section>
	);
}
