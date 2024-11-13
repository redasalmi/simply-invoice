import { redirect, useNavigation } from 'react-router';
import { getCompany, updateCompany } from '~/queries/company.queries';
import {
	CompanyFormSchema,
	transformCompanyFormData,
} from '~/schemas/company.schemas';
import { updateAddress } from '~/queries/address.queries';
import { updateCompanyCustomField } from '~/queries/companyCustomFields.queries';
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

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const { data, errors } = parseFormData(formData, CompanyFormSchema);

	if (errors) {
		return {
			errors,
		};
	}

	const { address, company, customFields } = transformCompanyFormData(data);
	await updateAddress(address);
	await updateCompany(company);

	if (customFields.length) {
		await Promise.all(
			customFields.map((customField) => updateCompanyCustomField(customField)),
		);
	}

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
