import * as React from 'react';
import {
	type ClientActionFunctionArgs,
	Form,
	redirect,
	useActionData,
	useNavigation,
} from '@remix-run/react';
import { Reorder } from 'framer-motion';
import { nanoid } from 'nanoid';
import queryString from 'query-string';
import { z } from 'zod';
import { AddFormField } from '~/components/AddFormField';
import { FormField, UncontrolledFormField } from '~/components/FormField';
import { Button } from '~/components/ui/button';
import { db } from '~/lib/db';
import type { CustomField, Field } from '~/lib/types';
import { createCustomer, getCustomerActionErrors } from '~/utils/customer';

export async function clientAction({ request }: ClientActionFunctionArgs) {
	try {
		const formQueryString = await request.text();
		const formData = queryString.parse(formQueryString, { sort: false });
		const newCustomer = createCustomer(formData);
		await db.customers.add(newCustomer);

		return redirect('/customers');
	} catch (err) {
		if (err instanceof z.ZodError) {
			const errors = getCustomerActionErrors<'create'>(err);

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
		label: 'Address 1 *',
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
	// const { toast } = useToast();
	// const dismissRef = React.useRef<(() => void) | null>(null);

	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	// React.useEffect(() => {
	// 	if (isSubmitting) {
	// 		dismissRef.current = toast({
	// 			title: 'Saving Customer',
	// 		}).dismiss;
	// 	}
	// }, [toast, isSubmitting]);

	// React.useEffect(() => {
	// 	return () => {
	// 		if (dismissRef.current) {
	// 			dismissRef.current();
	// 		}
	// 	};
	// }, []);

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
					<Button disabled={isSubmitting} type="submit">
						{isLoading ? '...Saving Customer' : 'Save Customer'}
					</Button>
				</div>
			</Form>
		</section>
	);
}
