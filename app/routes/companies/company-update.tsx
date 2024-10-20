import { redirect, useNavigation } from 'react-router';
import { db } from '~/lib/db';
import { UpdateEntityForm } from '~/components/entity/Update';
import { EntityNotFound } from '~/components/entity/Error';
import { parseCustomFields } from '~/utils/parseCustomFields.utils';
import { entityFormSchema } from '~/schemas/entity.schemas';
import { parseFormData } from '~/utils/parseForm.utils';
import type { UpdateCompany } from '~/types/company.types';
import { useForm } from '~/hooks/useForm';
import type * as Route from './+types.company-update';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const companyId = params.id;

	return {
		company: await db.companies.get(companyId),
	};
}

export async function clientAction({
	params,
	request,
}: Route.ClientActionArgs) {
	const companyId = params.id;

	const formData = await request.formData();
	const { data, errors } = parseFormData(formData, entityFormSchema);

	if (errors) {
		return {
			errors,
		};
	}

	const today = new Date().toISOString();
	const updatedCompany = {
		custom: parseCustomFields(formData),
		updatedAt: today,
	} as UpdateCompany;

	for (const key in data) {
		if (key.includes('custom')) {
			continue;
		}

		updatedCompany[key.replace('-', '.') as keyof UpdateCompany] =
			data[key as keyof typeof data];
	}
	await db.companies.update(companyId, updatedCompany);

	return redirect('/companies');
}

export default function CompanyUpdateRoute({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const company = loaderData?.company;

	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	const { errors, handleSubmit } = useForm({
		schema: entityFormSchema,
		actionErrors: actionData?.errors,
	});

	if (!company) {
		return (
			<section>
				<EntityNotFound type="company" baseUrl="/companies" />
			</section>
		);
	}

	return (
		<section>
			<UpdateEntityForm
				type="company"
				entity={company}
				isLoading={isLoading}
				isSubmitting={isSubmitting}
				errors={errors}
				handleSubmit={handleSubmit}
			/>
		</section>
	);
}
