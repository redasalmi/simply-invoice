import type { ActionFunctionArgs } from '@remix-run/node';
import { Form, redirect, useActionData, useNavigation } from '@remix-run/react';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { db } from '~/lib/db';
import { servicesFields } from '~/lib/constants';
import { FormField } from '~/components/FormField';
import {
	parseCreateServiceForm,
	parseServiceActionErrors,
} from '~/utils/service.utils';
import { createServiceSchema } from '~/schemas/service.schemas';

export async function clientAction({ request }: ActionFunctionArgs) {
	try {
		const formData = await request.formData();
		const newService = parseCreateServiceForm(formData);
		createServiceSchema.parse(newService);
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
			<Form method="POST">
				{servicesFields.map((field) => (
					<FormField
						key={field.id}
						className="my-2"
						error={actionData?.errors?.[field.name]}
						{...field}
					/>
				))}

				<Button disabled={isSubmitting} type="submit">
					{isLoading ? 'Saving Service...' : 'Save Service'}
				</Button>
			</Form>
		</section>
	);
}
