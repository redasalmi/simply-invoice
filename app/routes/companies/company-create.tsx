import { redirect, useNavigation } from 'react-router';
import { CreateEntityForm } from '~/components/entity/Create';
import { useForm } from '~/hooks/useForm';
import {
	EntityFormSchema,
	transformEntityFormSchemaData,
} from '~/schemas/entity.schemas';
import { parseFormData } from '~/utils/parseForm.utils';
import { createCompany } from '~/queries/company.queries';
import { createAddress } from '~/queries/address.queries';
import { createCompanyCustomField } from '~/queries/companyCustomFields.queries';
import type * as Route from './+types.company-create';

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const { data, issues } = parseFormData(formData, EntityFormSchema);

	if (issues) {
		return {
			issues,
		};
	}

	const {
		address,
		entity: company,
		customFields,
	} = transformEntityFormSchemaData(data, 'companyId', 'companyCustomFieldId');

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

	const { issues, handleSubmit } = useForm({
		schema: EntityFormSchema,
		actionIssues: actionData?.issues,
	});

	return (
		<section>
			<CreateEntityForm
				type="company"
				isSubmitting={isSubmitting}
				isLoading={isLoading}
				errors={issues}
				handleSubmit={handleSubmit}
			/>
		</section>
	);
}
