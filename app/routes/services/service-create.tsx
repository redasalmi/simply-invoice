import { useNavigation, redirect } from 'react-router';
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
	NumberFieldRoot,
} from '~/components/ui/number-field';
import { useForm } from '~/hooks/useForm';
import { ServiceFormSchema } from '~/schemas/service.schemas';
import { parseFormData } from '~/utils/parseForm.utils';
import { createService } from '~/queries/service.queries';
import type { Route } from './+types/service-create';

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const { data: service, errors } = parseFormData(formData, ServiceFormSchema);

	if (errors) {
		return {
			errors,
		};
	}

	await createService(service);

	return redirect('/services');
}

export default function ServiceCreateRoute({
	actionData,
}: Route.ComponentProps) {
	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	const { errors, resetErrors, handleSubmit } = useForm({
		schema: ServiceFormSchema,
		actionErrors: actionData?.errors,
	});

	return (
		<section>
			<Form
				method="post"
				errors={errors?.nested}
				onClearErrors={resetErrors}
				onSubmit={handleSubmit}
			>
				<FieldRoot name="name" className="my-2">
					<FieldLabel>Name</FieldLabel>
					<FieldControl type="text" />
					<FieldError />
				</FieldRoot>

				<FieldRoot name="description" className="my-2">
					<FieldLabel>Description</FieldLabel>
					<FieldControl type="text" />
					<FieldError />
				</FieldRoot>

				<FieldRoot name="rate" className="my-2" onChange={resetErrors}>
					{/* TODO: improve this when a new version is released or some examples are available */}
					<FieldLabel>Rate</FieldLabel>
					<NumberFieldRoot name="rate">
						<NumberFieldGroup>
							<NumberFieldDecrement />
							<NumberFieldInput />
							<NumberFieldIncrement />
						</NumberFieldGroup>
					</NumberFieldRoot>
					<FieldError />
				</FieldRoot>

				<Button disabled={isSubmitting} type="submit">
					{isLoading ? 'Saving Service...' : 'Save Service'}
				</Button>
			</Form>
		</section>
	);
}
