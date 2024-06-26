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
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { db } from '~/lib/db';
import { servicesFields } from '~/lib/constants';
import { FormField } from '~/components/ui/form-field';
import {
	parseServiceActionErrors,
	parseUpdateServiceForm,
} from '~/utils/service.utils';
import { updateServiceSchema } from '~/schemas/service.schemas';

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
		const serviceFormData = parseUpdateServiceForm(serviceId, formData);
		const updatedService = updateServiceSchema.parse(serviceFormData);
		await db.services.update(updatedService.id, updatedService);

		return redirect('/services');
	} catch (err) {
		if (err instanceof z.ZodError) {
			const errors = parseServiceActionErrors<'update'>(err);

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
					<p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Name *
					</p>
					<Skeleton className="h-10" />
				</div>
				<div className="my-2">
					<p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Description
					</p>
					<Skeleton className="h-10" />
				</div>
				<div className="my-2">
					<p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Rate *
					</p>
					<Skeleton className="h-10" />
				</div>
			</div>

			<div>
				<Button type="button">Update Service</Button>
			</div>
		</section>
	);
}

export default function ServiceUpdateRoute() {
	const { service } = useLoaderData<typeof clientLoader>();
	const actionData = useActionData<typeof clientAction>();

	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

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

	return (
		<section>
			<Form method="POST">
				{servicesFields.map((field) => (
					<FormField
						id={field.id}
						key={field.id}
						className="my-2"
						error={actionData?.errors?.[field.name]}
						label={field.label}
						input={{
							...field.input,
							defaultValue: service[field.input.name],
						}}
					/>
				))}

				<Button isDisabled={isSubmitting} type="submit">
					{isLoading ? 'Updating Service...' : 'Update Service'}
				</Button>
			</Form>
		</section>
	);
}
