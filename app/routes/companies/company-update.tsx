import { redirect, useNavigation } from 'react-router';
import { getCompany } from '~/queries/company.queries';
import {
	CompanyFormSchema,
	transformCompanyFormData,
} from '~/schemas/company.schemas';
import { parseFormData } from '~/utils/parseForm.utils';
import { CompanyNotFound } from '~/components/company/CompanyNotFound';
import { CompanyUpdate } from '~/components/company/CompanyUpdate';
import { useForm } from '~/hooks/useForm';
import type * as Route from './+types.company-update';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const companyId = params.id;

	return {
		company: await getCompany(companyId),
	};
}

export async function clientAction({
	params,
	request,
}: Route.ClientActionArgs) {
	const companyId = params.id;
	const formData = await request.formData();
	const { data, errors } = parseFormData(formData, CompanyFormSchema);

	if (errors) {
		return {
			errors,
		};
	}

	const { address, company, customFields } = transformCompanyFormData(data);
	console.log({ address, company, customFields });

	return {};

	// const today = new Date().toISOString();
	// const updatedCompany = {
	// 	custom: parseCustomFields(formData),
	// 	updatedAt: today,
	// } as UpdateCompany;

	// for (const key in data) {
	// 	if (key.includes('custom')) {
	// 		continue;
	// 	}

	// 	updatedCompany[key.replace('-', '.') as keyof UpdateCompany] =
	// 		data[key as keyof typeof data];
	// }
	// await db.companies.update(companyId, updatedCompany);

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
		schema: CompanyFormSchema,
		actionErrors: actionData?.errors,
	});

	if (!company) {
		return (
			<section>
				<CompanyNotFound />
			</section>
		);
	}

	return (
		<section>
			<CompanyUpdate
				company={company}
				isLoading={isLoading}
				isSubmitting={isSubmitting}
				errors={errors}
				handleSubmit={handleSubmit}
			/>
		</section>
	);
}
