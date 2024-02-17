import type { ActionFunctionArgs } from '@remix-run/node';
import { Form, redirect, useActionData, useNavigation } from '@remix-run/react';
import { nanoid } from 'nanoid';
import { ulid } from 'ulid';
import { z } from 'zod';

import { UncontrolledFormField } from '~/components';
import { Button } from '~/components/ui';

import { serviceSchema } from '~/lib/schemas';
import type { ServiceSchemaErrors } from '~/lib/schemas';
import { db } from '~/lib/stores';
import type { Field } from '~/lib/types';

type ActionErrors = {
	name?: string;
	price?: string;
};

export async function clientAction({ request }: ActionFunctionArgs) {
	try {
		const formData = await request.formData();

		const newService = serviceSchema.parse({
			id: ulid(),
			name: String(formData.get('name')),
			description: String(formData.get('description')),
			price: Number(formData.get('price')),
		});
		await db.services.add(newService);

		return redirect('/services');
	} catch (err) {
		if (err instanceof z.ZodError) {
			const zodErrors: ServiceSchemaErrors = err.format();
			const errors: ActionErrors = {};

			if (zodErrors.name?._errors?.[0]) {
				errors.name = zodErrors.name._errors[0];
			}
			if (zodErrors.price?._errors?.[0]) {
				errors.price = zodErrors.price._errors[0];
			}

			return {
				errors,
			};
		}
	}
}

const servicesFields: Array<Field> = [
	{
		id: nanoid(),
		label: 'Name *',
		name: 'name',
		input: {
			required: true,
		},
	},
	{
		id: nanoid(),
		label: 'Description',
		name: 'description',
	},
	{
		id: nanoid(),
		label: 'Price *',
		name: 'price',
		input: {
			type: 'number',
			required: true,
		},
	},
];

export default function NewServiceRoute() {
	const actionData = useActionData<typeof clientAction>();
	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';

	return (
		<section>
			<Form method="POST">
				{servicesFields.map((field) => (
					<UncontrolledFormField
						key={field.id}
						className="my-2"
						formField={{
							...field,
							error: actionData?.errors?.[field.name],
						}}
					/>
				))}

				<Button type="submit">
					{isLoading ? 'Saving Service...' : 'Save Service'}
				</Button>
			</Form>
		</section>
	);
}
