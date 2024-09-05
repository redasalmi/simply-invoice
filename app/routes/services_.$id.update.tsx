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
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { db } from '~/lib/db';
import { servicesFields } from '~/lib/constants';
import { FormField } from '~/components/FormField';
import { FormRoot } from '~/components/ui/form';
import { UpdatedService } from '~/types/service.types';
import { serviceFormSchema } from '~/schemas/service.schemas';
import { useForm } from '~/hooks/useForm';
import { parseFormData } from '~/utils/parseForm.utils';

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
	const serviceId = params.id;
	invariant(serviceId, 'Service ID is required');

	return {
		service: await db.services.get(serviceId),
	};
}

export async function clientAction({
	params,
	request,
}: ClientActionFunctionArgs) {
	const serviceId = params.id;
	invariant(serviceId, 'Service ID is required');

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

export default function ServiceUpdateRoute() {
	const { service } = useLoaderData<typeof clientLoader>();
	const actionData = useActionData<typeof clientAction>();

	const navigation = useNavigation();
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
