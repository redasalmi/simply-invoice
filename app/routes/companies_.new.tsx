import * as React from 'react';
import { Form, redirect, useActionData, useNavigation } from '@remix-run/react';
import queryString from 'query-string';
import { nanoid } from 'nanoid';
import { Reorder } from 'framer-motion';
import { z } from 'zod';

import { AddFormField, FormField, UncontrolledFormField } from '~/components';
import { Button } from '~/components/ui';
import { companiesStore } from '~/lib/stores';

import type { ClientActionFunctionArgs } from '@remix-run/react';
import type { Company, CustomField, Field } from '~/lib/types';
import { compamySchema } from '~/lib/schemas';

type ActionErrors = {
	name?: string;
	email?: string;
	address1?: string;
	country?: string;
	custom?: Record<string, { label?: string; content?: string }>;
};

type CompanySchemaErrors = z.inferFormattedError<typeof compamySchema>;

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

		const newCompany = compamySchema.parse({
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
		await companiesStore.setItem<Company>(newCompany.id, newCompany);

		return redirect('/companies');
	} catch (err) {
		if (err instanceof z.ZodError) {
			const zodErrors: CompanySchemaErrors = err.format();
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

const companyFields: Array<Field> = [
	{
		id: nanoid(),
		name: 'name',
		label: 'Name *',
	},
	{
		id: nanoid(),
		name: 'email',
		label: 'Email *',
		input: {
			type: 'email',
		},
	},
];

const addressFields: Array<Field> = [
	{
		id: nanoid(),
		name: 'address1',
		label: 'Address 1 *',
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

export default function NewCompanyRoute() {
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
					{companyFields.map((field) => (
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
					<h3 className="text-2xl">Custom Fields</h3>
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
						{isLoading ? '...Saving Company' : 'Save Company'}
					</Button>
				</div>
			</Form>
		</section>
	);
}
