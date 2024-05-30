import {
	type ClientActionFunctionArgs,
	redirect,
	useActionData,
	useNavigation,
} from '@remix-run/react';
import { z } from 'zod';
import { CreateEntity } from '~/components/Entities/create';
import { createEntity } from '~/components/Entities/utils';
import { db } from '~/lib/db';
import { createCompanySchema } from '~/lib/schemas';
import { getCompanyActionErrors } from '~/utils/company';
import type { Company } from '~/lib/types';

export async function clientAction({ request }: ClientActionFunctionArgs) {
	try {
		const formData = await request.formData();
		const newCompany = createEntity<Company>(formData);
		createCompanySchema.parse(newCompany);
		await db.companies.add(newCompany);

		return redirect('/companies');
	} catch (err) {
		if (err instanceof z.ZodError) {
			const errors = getCompanyActionErrors<'create'>(err);

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
