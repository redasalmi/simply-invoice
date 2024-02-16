import {
	Form,
	Link,
	redirect,
	useActionData,
	useLoaderData,
	useNavigation,
} from '@remix-run/react';
import invariant from 'tiny-invariant';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { servicesStore } from '~/lib/stores';

import { UncontrolledFormField } from '~/components';
import { Button } from '~/components/ui';

import type {
	ClientActionFunctionArgs,
	ClientLoaderFunctionArgs,
} from '@remix-run/react';
import type { Field, Service } from '~/lib/types';

type ActionErrors = {
	name?: string;
	price?: string;
};

const serviceSchema = z.object({
	id: z.string(),
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional(),
	price: z.number().min(0, 'Price must be greater than or equal to 0'),
});
type ServiceSchemaErrors = z.inferFormattedError<typeof serviceSchema>;

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
	invariant(params.id, 'Service ID is required');
	const serviceId = params.id;

	return {
		service: await servicesStore.getItem<Service>(serviceId),
	};
}

export async function clientAction({
	params,
	request,
}: ClientActionFunctionArgs) {
	let updatedService: Service | null = null;

	try {
		invariant(params.id, 'Service ID is required');

		const serviceId = params.id;
		const formData = await request.formData();

		updatedService = {
			id: serviceId,
			name: String(formData.get('name')),
			description: String(formData.get('description')),
			price: Number(formData.get('price')),
		};

		serviceSchema.parse(updatedService);
		await servicesStore.setItem<Service>(updatedService.id, updatedService);

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
				updatedService,
			};
		}
	}
}

const nameId = nanoid();
const descriptionId = nanoid();
const priceId = nanoid();

export default function ServiceUpdateRoute() {
	const { service } = useLoaderData<typeof clientLoader>();
	const actionData = useActionData<typeof clientAction>();
	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';

	if (!service) {
		return (
			<section>
				<div>
					<p className="m-12">
						Sorry, but no service with this ID was found! Please click{' '}
						<Link
							to="/services"
							aria-label="services list"
							className="hover:underline"
						>
							Here
						</Link>{' '}
						to navigate back to your services list.
					</p>
				</div>
			</section>
		);
	}

	const servicesFields: Array<Field> = [
		{
			id: nameId,
			label: 'Name *',
			name: 'name',
			input: {
				defaultValue: actionData?.updatedService?.name || service.name,
			},
		},
		{
			id: descriptionId,
			label: 'Description',
			name: 'description',
			input: {
				defaultValue:
					actionData?.updatedService?.description || service.description,
			},
		},
		{
			id: priceId,
			label: 'Price *',
			name: 'price',
			input: {
				type: 'number',
				defaultValue: actionData?.updatedService?.price || service.price,
			},
		},
	];

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
					{isLoading ? 'Updating Service...' : 'Update Service'}
				</Button>
			</Form>
		</section>
	);
}
