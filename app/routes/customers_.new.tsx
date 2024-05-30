import * as React from 'react';
import {
	type ClientActionFunctionArgs,
	Form,
	redirect,
	useActionData,
	useNavigation,
} from '@remix-run/react';
import { Reorder } from 'framer-motion';
import queryString from 'query-string';
import { z } from 'zod';
import { AddFormField } from '~/components/AddFormField';
import { FormField } from '~/components/FormField';
import { Button } from '~/components/ui/button';
import { db } from '~/lib/db';
import type { CustomField } from '~/lib/types';
import { createCustomer, getCustomerActionErrors } from '~/utils/customer';
import { NewFormField } from '~/components/NewFormField';
import { addressFields, informationFields } from '~/lib/constants';

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

export default function NewCustomerRoute() {
	const actionData = useActionData<typeof clientAction>();

	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

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
					{informationFields.map((field) => (
						<NewFormField
							key={field.id}
							className="my-2"
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
								error={actionData?.errors?.[field.name]}
								{...field}
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
