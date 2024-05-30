import * as React from 'react';
import {
	type ClientActionFunctionArgs,
	type ClientLoaderFunctionArgs,
	Form,
	Link,
	redirect,
	useActionData,
	useLoaderData,
	useNavigation,
} from '@remix-run/react';
import { Reorder } from 'framer-motion';
import queryString from 'query-string';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { AddFormField } from '~/components/AddFormField';
import { FormField } from '~/components/FormField';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { db } from '~/lib/db';
import type { CustomField } from '~/lib/types';
import { getCustomerActionErrors, updateCustomer } from '~/utils/customer';
import { addressFields, informationFields } from '~/lib/constants';
import { NewFormField } from '~/components/NewFormField';

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
		const updatedCustomer = updateCustomer(customerId, formData);
		await db.customers.update(updatedCustomer.id, updatedCustomer);

		return redirect('/customers');
	} catch (err) {
		if (err instanceof z.ZodError) {
			const errors = getCustomerActionErrors<'update'>(err);

			return {
				errors,
			};
		}
	}
}

export function HydrateFallback() {
	return (
		<section>
			<div>
				<div className="my-2">
					<p className="mb-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Name *
					</p>
					<Skeleton className="h-10" />
				</div>
				<div className="my-2">
					<p className="mb-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Email *
					</p>
					<Skeleton className="h-10" />
				</div>
			</div>

			<div>
				<h3 className="text-2xl">Address</h3>

				<div className="my-2">
					<p className="mb-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Address 1 *
					</p>
					<Skeleton className="h-10" />
				</div>
				<div className="my-2">
					<p className="mb-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Address 2
					</p>
					<Skeleton className="h-10" />
				</div>
				<div className="my-2">
					<p className="mb-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Country *
					</p>
					<Skeleton className="h-10" />
				</div>
				<div className="my-2">
					<p className="mb-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Province
					</p>
					<Skeleton className="h-10" />
				</div>
				<div className="my-2">
					<p className="mb-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						City
					</p>
					<Skeleton className="h-10" />
				</div>
				<div className="my-2">
					<p className="mb-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Zip
					</p>
					<Skeleton className="h-10" />
				</div>
			</div>

			<div className="my-2">
				<h3 className="text-2xl">Custom Fields</h3>
				<p className="mb-2 block text-sm">
					Add any custom fields and order them
				</p>
				<div>
					<Button type="button">Add New Field</Button>
				</div>
			</div>

			<div>
				<Button type="button">Update Customer</Button>
			</div>
		</section>
	);
}

export default function CustomerUpdateRoute() {
	const { customer } = useLoaderData<typeof clientLoader>();
	const actionData = useActionData<typeof clientAction>();

	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

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
					{informationFields.map((field) => (
						<NewFormField
							key={field.id}
							className="my-2"
							defaultValue={customer[field.name]}
							error={actionData?.errors?.[field.name]}
							{...field}
						/>
					))}
				</div>

				<div>
					<h3 className="text-2xl">Address</h3>
					<div>
						{addressFields.map((field) => (
							<NewFormField
								key={field.id}
								className="my-2"
								defaultValue={
									customer.address[field.name.replace('address-', '')]
								}
								error={actionData?.errors?.[field.name]}
								{...field}
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
					<Button disabled={isSubmitting} type="submit">
						{isLoading ? '...Updating Customer' : 'Update Customer'}
					</Button>
				</div>
			</Form>
		</section>
	);
}
