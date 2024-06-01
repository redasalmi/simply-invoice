import {
	type ClientActionFunctionArgs,
	redirect,
	useActionData,
	useNavigation,
} from '@remix-run/react';
import { z } from 'zod';
import { CreateEntityForm } from '~/components/Entities/create';
import { db } from '~/lib/db';
import { createEntitySchema } from '~/schemas/entity.schemas';
import type { Company } from '~/types/company.types';
import {
	parseCreateEntityErrors,
	parseCreateEntityForm,
} from '~/utils/entity.utils';

export async function clientAction({ request }: ClientActionFunctionArgs) {
	try {
		const formData = await request.formData();
		const newCompany = parseCreateEntityForm<Company>(formData);
		createEntitySchema.parse(newCompany);
		await db.companies.add(newCompany);

		return redirect('/companies');
	} catch (err) {
		if (err instanceof z.ZodError) {
			const errors = parseCreateEntityErrors(err);

			return {
				errors,
			};
		}
	}
}

export default function NewCompanyRoute() {
	const actionData = useActionData<typeof clientAction>();

	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	return (
		<section>
			<CreateEntityForm
				type="company"
				isSubmitting={isSubmitting}
				isLoading={isLoading}
				errors={actionData?.errors}
			/>
		</section>
	);
}
