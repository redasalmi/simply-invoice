import {
	Form,
	useActionData,
	useNavigation,
	redirect,
	ClientActionFunctionArgs,
} from '@remix-run/react';
import { FormField } from '~/components/FormField';
import { FormRoot } from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import { db } from '~/lib/db';
import { servicesFields } from '~/lib/constants';
import { ulid } from 'ulid';
import { Service } from '~/types/service.types';
import { useForm } from '~/hooks/useForm';
import { serviceFormSchema } from '~/schemas/service.schemas';
import { parseFormData } from '~/utils/parseForm.utils';

export async function clientAction({ request }: ClientActionFunctionArgs) {
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

export default function NewServiceRoute() {
	const actionData = useActionData<typeof clientAction>();

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
