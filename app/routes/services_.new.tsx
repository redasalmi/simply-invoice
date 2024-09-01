import type { ActionFunctionArgs } from '@remix-run/node';
import { Form, redirect, useActionData, useNavigation } from '@remix-run/react';
import { FormField } from '~/components/FormField';
import { FormRoot } from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import { db } from '~/lib/db';
import { servicesFields } from '~/lib/constants';
import {
	parseServiceActionErrors,
	parseServiceForm,
} from '~/utils/service.utils';
import { ulid } from 'ulid';
import { Service } from '~/types/service.types';

export async function clientAction({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const serviceFormData = parseServiceForm(formData);

	if (serviceFormData.error) {
		return {
			errors: parseServiceActionErrors(serviceFormData.error),
		};
	}

	const today = new Date().toISOString();
	const newService: Service = Object.assign(
		{
			id: ulid(),
			createdAt: today,
			updatedAt: today,
		},
		serviceFormData.data,
	);
	await db.services.add(newService);

	return redirect('/services');
}

export default function NewServiceRoute() {
	const actionData = useActionData<typeof clientAction>();

	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	return (
		<section>
			<FormRoot asChild>
				<Form method="POST">
					{servicesFields.map((field) => (
						<FormField
							key={field.id}
							className="my-2"
							serverError={actionData?.errors?.[field.name]}
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
