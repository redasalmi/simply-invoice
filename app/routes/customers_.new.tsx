import {
	type ClientActionFunctionArgs,
	redirect,
	useActionData,
	useNavigation,
} from '@remix-run/react';
import { z } from 'zod';
import { CreateEntityForm } from '~/components/entity/create';
import { db } from '~/lib/db';
import { createEntitySchema } from '~/schemas/entity.schemas';
import {
	parseCreateEntityErrors,
	parseCreateEntityForm,
} from '~/utils/entity.utils';

export async function clientAction({ request }: ClientActionFunctionArgs) {
	try {
		const formData = await request.formData();
		const customerFormaData = parseCreateEntityForm(formData);
		const newCustomer = createEntitySchema.parse(customerFormaData);
		await db.customers.add(newCustomer);

		return redirect('/customers');
	} catch (err) {
		if (err instanceof z.ZodError) {
			const errors = parseCreateEntityErrors(err);

			return {
				errors,
			};
		}
	}
}

export default function NewCustomerRoute() {
	const actionData = useActionData<typeof clientAction>();

	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	return (
		<section>
			<CreateEntityForm
				type="customer"
				isSubmitting={isSubmitting}
				isLoading={isLoading}
				errors={actionData?.errors}
			/>
		</section>
	);
}
