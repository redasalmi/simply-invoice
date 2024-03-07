import type { ActionFunctionArgs } from '@remix-run/node';
import { Form, redirect, useActionData, useNavigation } from '@remix-run/react';
import { nanoid } from 'nanoid';
import { ulid } from 'ulid';
import { z } from 'zod';

import { UncontrolledFormField } from '~/components/FormField';
import { Button } from '~/components/ui/button';

import { db } from '~/lib/db';
import { createServiceSchema } from '~/lib/schemas';
import type { CreateServiceSchemaErrors } from '~/lib/schemas';
import type { Field } from '~/lib/types';

type ActionErrors = {
	name?: string;
	rate?: string;
};

export async function clientAction({ request }: ActionFunctionArgs) {
	try {
		const formData = await request.formData();

		const today = new Date().toLocaleDateString();
		const newService = createServiceSchema.parse({
			id: ulid(),
			name: formData.get('name')?.toString(),
			description: formData.get('description')?.toString(),
			rate: Number(formData.get('rate')),
			createdAt: today,
			updatedAt: today,
		});
		await db.services.add(newService);

		return redirect('/services');
	} catch (err) {
		if (err instanceof z.ZodError) {
			const zodErrors: CreateServiceSchemaErrors = err.format();
			const errors: ActionErrors = {};

			if (zodErrors.name?._errors?.[0]) {
				errors.name = zodErrors.name._errors[0];
			}
			if (zodErrors.rate?._errors?.[0]) {
				errors.rate = zodErrors.rate._errors[0];
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
		label: 'Rate *',
		name: 'rate',
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
