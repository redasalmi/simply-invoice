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
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { db } from '~/lib/db';
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

	const [customFields, setCustomFields] = React.useState<Array<{ id: string }>>(
		[],
	);

	const addField = () => {
		setCustomFields((prevFields) => prevFields.concat({ id: ulid() }));
	};

	const deleteField = (id: string) => {
		setCustomFields((prevFields) =>
			prevFields.filter((field) => field.id !== id),
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

				<div>
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-2xl">Custom Fields</h3>
							<p className="mb-2 block text-sm">
								Add any custom fields and order them
							</p>
						</div>
						<div>
							<Button onClick={addField}>Add New Custom Field</Button>
						</div>
					</div>

					<div>
						{customFields.length ? (
							<Reorder.Group values={customFields} onReorder={setCustomFields}>
								{customFields.map((field, index) => (
									<Reorder.Item key={field.id} value={field}>
										<div className="my-2 flex items-center gap-2">
											<Input
												name="order"
												defaultValue={index}
												className="hidden"
											/>

											<NewFormField
												id={field.id}
												name={`label-${field.id}`}
												label="Label *"
												required
												className="flex-1"
												error={actionData?.errors?.custom?.[index]?.label}
											/>

											<NewFormField
												id={field.id}
												name={`content-${field.id}`}
												label="Content *"
												required
												className="flex-1"
												error={actionData?.errors?.custom?.[index]?.content}
											/>

											<div className="mt-auto flex gap-2">
												<Button>Show Label In Invoice</Button>
												<Button>Reorder</Button>
												<Button onClick={() => deleteField(field.id)}>
													Delete Custom Field
												</Button>
											</div>
										</div>
									</Reorder.Item>
								))}
							</Reorder.Group>
						) : null}
					</div>
				</div>

				<div>
					<Button disabled={isSubmitting} type="submit">
						{isLoading ? '...Saving Customer' : 'Save Customer'}
					</Button>
				</div>
			</Form>
		</section>
	);
}
