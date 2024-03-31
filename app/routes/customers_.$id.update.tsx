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
import { nanoid } from 'nanoid';
import queryString from 'query-string';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { AddFormField } from '~/components/AddFormField';
import { FormField, UncontrolledFormField } from '~/components/FormField';
import { Button } from '~/components/ui/button';
import { labelVariants } from '~/components/ui/label';
import { Skeleton } from '~/components/ui/skeleton';
import { useToast } from '~/components/ui/use-toast';
import { db } from '~/lib/db';
import type { CustomField, Field } from '~/lib/types';
import { getCustomerActionErrors, updateCustomer } from '~/utils/customer';
import { cn } from '~/utils/shared';

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
					<p className={cn(labelVariants(), 'mb-1')}>Name *</p>
					<Skeleton className="h-10" />
				</div>
				<div className="my-2">
					<p className={cn(labelVariants(), 'mb-1')}>Email *</p>
					<Skeleton className="h-10" />
				</div>
			</div>

			<div>
				<h3 className="text-2xl">Address</h3>

				<div className="my-2">
					<p className={cn(labelVariants(), 'mb-1')}>Address 1 *</p>
					<Skeleton className="h-10" />
				</div>
				<div className="my-2">
					<p className={cn(labelVariants(), 'mb-1')}>Address 2</p>
					<Skeleton className="h-10" />
				</div>
				<div className="my-2">
					<p className={cn(labelVariants(), 'mb-1')}>Country *</p>
					<Skeleton className="h-10" />
				</div>
				<div className="my-2">
					<p className={cn(labelVariants(), 'mb-1')}>Province</p>
					<Skeleton className="h-10" />
				</div>
				<div className="my-2">
					<p className={cn(labelVariants(), 'mb-1')}>City</p>
					<Skeleton className="h-10" />
				</div>
				<div className="my-2">
					<p className={cn(labelVariants(), 'mb-1')}>Zip</p>
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
	const { toast } = useToast();
	const dismissRef = React.useRef<(() => void) | null>(null);

	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	React.useEffect(() => {
		if (isSubmitting) {
			dismissRef.current = toast({
				title: 'Updating Customer',
			}).dismiss;
		}
	}, [toast, isSubmitting]);

	React.useEffect(() => {
		return () => {
			if (dismissRef.current) {
				dismissRef.current();
			}
		};
	}, []);

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
					<Button disabled={isSubmitting} type="submit">
						{isLoading ? '...Updating Customer' : 'Update Customer'}
					</Button>
				</div>
			</Form>
		</section>
	);
}
