import {
	type ClientActionFunctionArgs,
	redirect,
	useActionData,
	useNavigation,
} from '@remix-run/react';
import { z } from 'zod';
import { CreateEntity } from '~/components/Entities/create';
import {
	parseCreateEntityErrors,
	parseCreateEntityForm,
} from '~/components/Entities/utils';
import { db } from '~/lib/db';
import { createEntitySchema } from '~/components/Entities/schema';
import type { Company } from '~/lib/types';

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
			<CreateEntity
				type="company"
				isSubmitting={isSubmitting}
				isLoading={isLoading}
				errors={actionData?.errors}
			/>
		</section>
	);
}
