import type { ActionFunctionArgs } from '@remix-run/node';
import { Form, redirect, useActionData, useNavigation } from '@remix-run/react';
import { z } from 'zod';
import { FormField } from '~/components/FormField';
import { FormRoot } from '~/components/ui/form';
import { Button } from '~/components/react-aria/button';
import { db } from '~/lib/db';
import { servicesFields } from '~/lib/constants';
import {
	parseCreateServiceForm,
	parseServiceActionErrors,
} from '~/utils/service.utils';
import { createServiceSchema } from '~/schemas/service.schemas';

export async function clientAction({ request }: ActionFunctionArgs) {
	try {
		const formData = await request.formData();
		const serviceFormData = parseCreateServiceForm(formData);
		const newService = createServiceSchema.parse(serviceFormData);
		await db.services.add(newService);

		return redirect('/services');
	} catch (err) {
		if (err instanceof z.ZodError) {
			const errors = parseServiceActionErrors<'create'>(err);

			return {
				errors,
			};
		}
	}
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

					<Button isDisabled={isSubmitting} type="submit">
						{isLoading ? 'Saving Service...' : 'Save Service'}
					</Button>
				</Form>
			</FormRoot>
		</section>
	);
}
