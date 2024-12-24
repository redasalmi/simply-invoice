import { redirect, useNavigation } from 'react-router';
import { useForm } from '~/hooks/useForm';
import {
	CompanyFormSchema,
	transformCompanyFormData,
} from '~/schemas/company.schemas';
import { parseFormData } from '~/utils/parseForm.utils';
import { createCompany } from '~/queries/company.queries';
import { createAddress } from '~/queries/address.queries';
import { CompanyCreate } from '~/components/company/CompanyCreate';
import type { Route } from './+types/company-create';

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const { data, errors } = parseFormData(formData, CompanyFormSchema);

	if (errors) {
		return {
			errors,
		};
	}

	const { address, company } = transformCompanyFormData(data);
	await Promise.all([createAddress(address), createCompany(company)]);

	return redirect('/companies');
}

export default function CompanyCreateRoute({
	actionData,
}: Route.ComponentProps) {
	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	const { errors, handleSubmit } = useForm({
		schema: CompanyFormSchema,
		actionErrors: actionData?.errors,
	});

	return (
		<section>
			<CompanyCreate
				isSubmitting={isSubmitting}
				isLoading={isLoading}
				errors={errors}
				handleSubmit={handleSubmit}
			/>
		</section>
	);
}
