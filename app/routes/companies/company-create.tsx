import { redirect, useNavigation } from 'react-router';
import { useForm } from '~/hooks/useForm';
import {
	CompanyFormSchema,
	transformCompanyFormData,
} from '~/schemas/company.schemas';
import { parseFormData } from '~/utils/parseForm.utils';
import { createCompany } from '~/queries/company.queries';
import { createAddress } from '~/queries/address.queries';
import { createCompanyCustomField } from '~/queries/companyCustomFields.queries';
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

	const { address, company, customFields } = transformCompanyFormData(data);
	await createAddress(address);
	await createCompany(company);

	if (customFields.length) {
		await Promise.all(
			customFields.map((customField) => createCompanyCustomField(customField)),
		);
	}

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
