import { Form, redirect, useNavigation } from '@remix-run/react';
import { nanoid } from 'nanoid';

import { UncontrolledFormField } from '~/components';
import { Button } from '~/components/ui';
import { servicesStore } from '~/lib/stores';

import type { ActionFunctionArgs } from '@remix-run/node';
import type { Field, Service } from '~/types';

export async function clientAction({ request }: ActionFunctionArgs) {
	const formData = await request.formData();

	const serviceId = nanoid();
	const newService = {
		id: serviceId,
		name: String(formData.get('name')),
		description: String(formData.get('description')),
		price: Number(formData.get('price')),
	};
	await servicesStore.setItem<Service>(serviceId, newService);

	return redirect('/services');
}

const servicesFields: Array<Field> = [
	{
		id: nanoid(),
		label: 'Name',
		name: 'name',
	},
	{
		id: nanoid(),
		label: 'Description',
		name: 'description',
	},
	{
		id: nanoid(),
		label: 'Price',
		name: 'price',
		input: {
			type: 'number',
		},
	},
];

export default function NewServiceRoute() {
	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';

	return (
		<section>
			<Form method="POST">
				{servicesFields.map((field) => (
					<UncontrolledFormField
						key={field.id}
						className="my-2"
						formField={field}
					/>
				))}

				<Button type="submit">
					{isLoading ? 'Saving Service...' : 'Save Service'}
				</Button>
			</Form>
		</section>
	);
}
