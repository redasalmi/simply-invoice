import { Link, redirect, useNavigation } from 'react-router';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import {
	FieldRoot,
	FieldLabel,
	FieldControl,
	FieldError,
} from '~/components/ui/field';
import {
	NumberFieldDecrement,
	NumberFieldGroup,
	NumberFieldIncrement,
	NumberFieldInput,
	NumberFieldLabel,
	NumberFieldRoot,
} from '~/components/ui/number-field';
import { getService, updateService } from '~/queries/service.queries';
import { ServiceFormSchema } from '~/schemas/service.schemas';
import { useForm } from '~/hooks/useForm';
import { parseFormData } from '~/utils/parseForm.utils';
import type { Route } from './+types/service-update';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const serviceId = params.id;

	return {
		service: await getService(serviceId),
	};
}

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const { data: service, errors } = parseFormData(formData, ServiceFormSchema);

	if (errors) {
		return {
			errors,
		};
	}

	await updateService(service);

	return redirect('/services');
}

export default function ServiceUpdateRoute({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const navigation = useNavigation();

	const service = loaderData?.service;
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	const { errors, resetErrors, handleSubmit } = useForm({
		schema: ServiceFormSchema,
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
			<Form
				method="post"
				errors={errors?.nested}
				onClearErrors={resetErrors}
				onSubmit={handleSubmit}
			>
				<input type="hidden" name="service-id" value={service.serviceId} />

				<FieldRoot name="name" className="my-2">
					<FieldLabel>Name</FieldLabel>
					<FieldControl type="text" defaultValue={service.name} />
					<FieldError />
				</FieldRoot>

				<FieldRoot name="description" className="my-2">
					<FieldLabel>Description</FieldLabel>
					<FieldControl type="text" defaultValue={service.description} />
					<FieldError />
				</FieldRoot>

				<FieldRoot name="rate" className="my-2">
					{/* NumberField is not integrated very well with the Form component for now, 
								that's why it's wrapper with a FieldRoot, look into this when a new version is released  
							*/}
					<NumberFieldRoot
						id="rate"
						name="rate"
						defaultValue={service.rate}
						onValueChange={resetErrors}
					>
						<NumberFieldLabel htmlFor="rate">Rate</NumberFieldLabel>
						<NumberFieldGroup>
							<NumberFieldDecrement />
							<NumberFieldInput name="rate" />
							<NumberFieldIncrement />
						</NumberFieldGroup>
					</NumberFieldRoot>
					<FieldError />
				</FieldRoot>

				<Button disabled={isSubmitting} type="submit">
					{isLoading ? 'Updating Service...' : 'Update Service'}
				</Button>
			</Form>
		</section>
	);
}
