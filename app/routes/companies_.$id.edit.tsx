import * as React from 'react';
import {
	Form,
	Link,
	redirect,
	useActionData,
	useLoaderData,
	useNavigation,
} from '@remix-run/react';
import queryString from 'query-string';
import { z } from 'zod';

import { companiesStore } from '~/lib/stores';

import type {
	ClientActionFunctionArgs,
	ClientLoaderFunctionArgs,
} from '@remix-run/react';

import type { Company, CustomField, Field } from '~/types';
import { nanoid } from 'nanoid';
import { Button } from '~/components/ui';
import { AddFormField, FormField, UncontrolledFormField } from '~/components';
import { Reorder } from 'framer-motion';

type ActionErrors = {
	name?: string;
	email?: string;
	address1?: string;
	country?: string;
	custom?: Record<string, { label?: string; content?: string }>;
};

const compamySchema = z.object({
	id: z.string(),
	name: z.string().min(1, 'Name is required'),
	email: z.string().email(),
	address: z.object({
		address1: z.string().min(1, 'Address 1 is required'),
		address2: z.string().optional(),
		city: z.string().optional(),
		country: z.string().min(1, 'Country is required'),
		province: z.string().optional(),
		zip: z.string().optional(),
	}),
	custom: z
		.array(
			z.object({
				id: z.string(),
				label: z.string().min(1, 'Label is required'),
				content: z.string().min(1, 'Content is required'),
				showLabel: z.boolean().optional(),
			}),
		)
		.optional(),
});
type CompanySchemaErrors = z.inferFormattedError<typeof compamySchema>;

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
	const companyId = params.id;

	return {
		company: companyId
			? await companiesStore.getItem<Company>(companyId)
			: null,
	};
}

export async function clientAction({
	params,
	request,
}: ClientActionFunctionArgs) {
	let updatedCompany: Company | null = null;

	try {
		const companyId = params.id;
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

		updatedCompany = {
			id: companyId,
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
		};

		compamySchema.parse(updatedCompany);
		await companiesStore.setItem<Company>(updatedCompany.id, updatedCompany);

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
				updatedCompany,
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

export default function EditCompanyRoute() {
	const { company } = useLoaderData<typeof clientLoader>();
	const actionData = useActionData<typeof clientAction>();
	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';

	const [formFields, setFormFields] = React.useState<Array<CustomField>>([]);

	React.useEffect(() => {
		const customFields: Array<CustomField> =
			(actionData?.updatedCompany?.custom || company?.custom)?.map(
				(field, index) => ({
					id: field.id,
					label: field.label,
					content: field.content,
					showLabel: field.showLabel,
					labelError: actionData?.errors?.custom?.[index]?.label,
					contentError: actionData?.errors?.custom?.[index]?.content,
				}),
			) || [];
		setFormFields(customFields);
	}, [
		actionData?.errors?.custom,
		actionData?.updatedCompany?.custom,
		company?.custom,
	]);

	if (!company) {
		return (
			<section>
				<div>
					<p className="m-12">
						Sorry, but no company with this ID was found! Please click{' '}
						<Link
							to="/companies"
							aria-label="companies list"
							className="hover:underline"
						>
							Here
						</Link>{' '}
						to navigate back to your companies list.
					</p>
				</div>
			</section>
		);
	}

	const companyFields: Array<Field> = [
		{
			id: nameId,
			name: 'name',
			label: 'Name *',
			input: {
				defaultValue: actionData?.updatedCompany?.name || company.name,
			},
		},
		{
			id: emailId,
			name: 'email',
			label: 'Email *',
			input: {
				type: 'email',
				defaultValue: actionData?.updatedCompany?.email || company.email,
			},
		},
	];

	const addressFields: Array<Field> = [
		{
			id: address1Id,
			name: 'address1',
			label: 'Address 1 *',
			input: {
				defaultValue:
					actionData?.updatedCompany?.address.address1 ||
					company.address.address1,
			},
		},
		{
			id: address2Id,
			name: 'address2',
			label: 'Address 2',
			input: {
				defaultValue:
					actionData?.updatedCompany?.address.address2 ||
					company.address.address2,
			},
		},
		{
			id: countryId,
			name: 'country',
			label: 'Country *',
			input: {
				defaultValue:
					actionData?.updatedCompany?.address.country ||
					company.address.country,
			},
		},
		{
			id: provinceId,
			name: 'province',
			label: 'Province',
			input: {
				defaultValue:
					actionData?.updatedCompany?.address.province ||
					company.address.province,
			},
		},
		{
			id: cityId,
			name: 'city',
			label: 'City',
			input: {
				defaultValue:
					actionData?.updatedCompany?.address.city || company.address.city,
			},
		},
		{
			id: zipId,
			name: 'zip',
			label: 'Zip',
			input: {
				defaultValue:
					actionData?.updatedCompany?.address.zip || company.address.zip,
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
						{isLoading ? '...Updating Company' : 'Update Company'}
					</Button>
				</div>
			</Form>
		</section>
	);
}
