import {
	Form,
	Link,
	redirect,
	useActionData,
	useLoaderData,
	useNavigation,
} from '@remix-run/react';
import type {
	ClientActionFunctionArgs,
	ClientLoaderFunctionArgs,
} from '@remix-run/react';
import { nanoid } from 'nanoid';
import invariant from 'tiny-invariant';
import { z } from 'zod';

import { UncontrolledFormField } from '~/components';
import { Button, labelVariants, Skeleton } from '~/components/ui';

import { serviceSchema, ServiceSchemaErrors } from '~/lib/schemas';
import { db } from '~/lib/stores';
import type { Field } from '~/lib/types';
import { cn } from '~/lib/utils';

type ActionErrors = {
	name?: string;
	price?: string;
};

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
	invariant(params.id, 'Service ID is required');
	const serviceId = params.id;

	return {
		service: await db.services.get(serviceId),
	};
}

export async function clientAction({
	params,
	request,
}: ClientActionFunctionArgs) {
	invariant(params.id, 'Service ID is required');

	try {
		const serviceId = params.id;
		const formData = await request.formData();

		const updatedService = serviceSchema.parse({
			id: serviceId,
			name: String(formData.get('name')),
			description: String(formData.get('description')),
			price: Number(formData.get('price')),
		});
		await db.services.update(updatedService.id, updatedService);

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

export function HydrateFallback() {
	return (
		<section>
			<div>
				<div className="my-2">
					<p className={cn(labelVariants(), 'mb-1')}>Name *</p>
					<Skeleton className="h-10" />
				</div>
				<div className="my-2">
					<p className={cn(labelVariants(), 'mb-1')}>Description</p>
					<Skeleton className="h-10" />
				</div>
				<div className="my-2">
					<p className={cn(labelVariants(), 'mb-1')}>Price *</p>
					<Skeleton className="h-10" />
				</div>
			</div>

			<div>
				<Button type="button">Update Service</Button>
			</div>
		</section>
	);
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
				required: true,
				defaultValue: service.name,
			},
			error: actionData?.errors.name,
		},
		{
			id: descriptionId,
			label: 'Description',
			name: 'description',
			input: {
				defaultValue: service.description,
			},
		},
		{
			id: priceId,
			label: 'Price *',
			name: 'price',
			input: {
				type: 'number',
				required: true,
				defaultValue: service.price,
			},
			error: actionData?.errors.price,
		},
	];

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
					{isLoading ? 'Updating Service...' : 'Update Service'}
				</Button>
			</Form>
		</section>
	);
}
