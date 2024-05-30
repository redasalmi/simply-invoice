import type { ActionFunctionArgs } from '@remix-run/node';
import { Form, redirect, useActionData, useNavigation } from '@remix-run/react';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { db } from '~/lib/db';
import { createService, getServiceActionErrors } from '~/utils/service';
import { servicesFields } from '~/lib/constants';
import { NewFormField } from '~/components/NewFormField';

export async function clientAction({ request }: ActionFunctionArgs) {
	try {
		const formData = await request.formData();
		const newService = createService(formData);
		await db.services.add(newService);

		return redirect('/services');
	} catch (err) {
		if (err instanceof z.ZodError) {
			const errors = getServiceActionErrors<'create'>(err);

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
					<NewFormField
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
