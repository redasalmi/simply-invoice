import { redirect, useNavigation } from 'react-router';
import { ulid } from 'ulid';
import { CreateEntityForm } from '~/components/entity/Create';
import { useForm } from '~/hooks/useForm';
import { entityFormSchema } from '~/schemas/entity.schemas';
import { parseCustomFields } from '~/utils/parseCustomFields.utils';
import { parseFormData } from '~/utils/parseForm.utils';
import { createCompany } from '~/queries/company.queries';
import { createAddress } from '~/queries/address.queries';
import { createCompanyCustomField } from '~/queries/company-custom-fields.queries';
import type * as Route from './+types.company-create';

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const { data, errors } = parseFormData(formData, entityFormSchema);

	if (errors) {
		return {
			errors,
		};
	}

	const addressId = ulid();
	const companyId = ulid();

	await createAddress({
		addressId,
		address1: data['address-address1'],
		address2: data['address-address2'],
		city: data['address-city'],
		country: data['address-country'],
		province: data['address-province'],
		zip: data['address-zip'],
	});
	await createCompany({
		companyId,
		name: data.name,
		email: data.email,
		addressId,
	});

	const customFields = parseCustomFields(data);
	if (customFields.length) {
		await Promise.all(
			customFields.map(({ id, order, label, content }) =>
				createCompanyCustomField({
					companyCustomFieldId: id,
					customFieldIndex: order,
					label,
					content,
					companyId,
				}),
			),
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
		schema: entityFormSchema,
		actionErrors: actionData?.errors,
	});

	return (
		<section>
			<CreateEntityForm
				type="company"
				isSubmitting={isSubmitting}
				isLoading={isLoading}
				errors={errors}
				handleSubmit={handleSubmit}
			/>
		</section>
	);
}
