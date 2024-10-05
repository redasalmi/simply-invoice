import { Form, useNavigation, redirect } from 'react-router';
import { FormField } from '~/components/FormField';
import { FormRoot } from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import { db } from '~/lib/db';
import { servicesFields } from '~/lib/constants';
import { ulid } from 'ulid';
import type { Service } from '~/types/service.types';
import { useForm } from '~/hooks/useForm';
import { serviceFormSchema } from '~/schemas/service.schemas';
import { parseFormData } from '~/utils/parseForm.utils';
import type * as Route from './+types.service-create';

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const { data, errors } = parseFormData(formData, serviceFormSchema);

	if (errors) {
		return {
			errors,
		};
	}

	const today = new Date().toISOString();
	const newService: Service = Object.assign(
		{
			id: ulid(),
			createdAt: today,
			updatedAt: today,
		},
		data,
	);
	await db.services.add(newService);

	return redirect('/services');
}

export default function NewServiceRoute({ actionData }: Route.ComponentProps) {
	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	const { errors, handleSubmit } = useForm({
		schema: serviceFormSchema,
		actionErrors: actionData?.errors,
	});

	return (
		<section>
			<FormRoot asChild>
				<Form method="POST" onSubmit={handleSubmit}>
					{servicesFields.map((field) => (
						<FormField
							key={field.id}
							className="my-2"
							serverError={errors?.[field.name]}
							{...field}
						/>
					))}

					<Button disabled={isSubmitting} type="submit">
						{isLoading ? 'Saving Service...' : 'Save Service'}
					</Button>
				</Form>
			</FormRoot>
		</section>
	);
}
