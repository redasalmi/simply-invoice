import { Form, Link, redirect, useNavigation } from 'react-router';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { db } from '~/lib/db';
import { servicesFields } from '~/lib/constants';
import { FormField } from '~/components/FormField';
import { FormRoot } from '~/components/ui/form';
import type { UpdatedService } from '~/types/service.types';
import { serviceFormSchema } from '~/schemas/service.schemas';
import { useForm } from '~/hooks/useForm';
import { parseFormData } from '~/utils/parseForm.utils';
import type * as Route from './+types.service-update';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const serviceId = params.id;

	return {
		service: await db.services.get(serviceId),
	};
}

export async function clientAction({
	params,
	request,
}: Route.ClientActionArgs) {
	const serviceId = params.id;

	const formData = await request.formData();
	const { data, errors } = parseFormData(formData, serviceFormSchema);

	if (errors) {
		return {
			errors,
		};
	}

	const today = new Date().toISOString();
	const updatedService: UpdatedService = Object.assign(
		{
			updatedAt: today,
		},
		data,
	);
	await db.services.update(serviceId, updatedService);

	return redirect('/services');
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
				<Button>Update Service</Button>
			</div>
		</section>
	);
}

export default function ServiceUpdateRoute({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const navigation = useNavigation();

	const service = loaderData?.service;
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	const { errors, handleSubmit } = useForm({
		schema: serviceFormSchema,
		actionErrors: actionData?.errors,
	});

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
			<FormRoot asChild>
				<Form method="POST" onSubmit={handleSubmit}>
					{servicesFields.map((field) => (
						<FormField
							key={field.id}
							className="my-2"
							defaultValue={service[field.name]}
							serverError={errors?.[field.name]}
							{...field}
						/>
					))}

					<Button disabled={isSubmitting} type="submit">
						{isLoading ? 'Updating Service...' : 'Update Service'}
					</Button>
				</Form>
			</FormRoot>
		</section>
	);
}
