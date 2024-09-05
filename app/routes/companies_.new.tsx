import {
	type ClientActionFunctionArgs,
	redirect,
	useActionData,
	useNavigation,
} from '@remix-run/react';
import { ulid } from 'ulid';
import { CreateEntityForm } from '~/components/entity/Create';
import { useForm } from '~/hooks/useForm';
import { db } from '~/lib/db';
import { entityFormSchema } from '~/schemas/entity.schemas';
import { Company } from '~/types/company.types';
import { parseCustomFields } from '~/utils/parseCustomFields.utils';
import { parseFormData } from '~/utils/parseForm.utils';

export async function clientAction({ request }: ClientActionFunctionArgs) {
	const formData = await request.formData();
	const { data, errors } = parseFormData(formData, entityFormSchema);

	if (errors) {
		return {
			errors,
		};
	}

	const today = new Date().toISOString();
	const newCompany: Company = {
		id: ulid(),
		name: data.name,
		email: data.email,
		address: {
			id: ulid(),
			address1: data['address-address1'],
			address2: data['address-address2'],
			city: data['address-city'],
			country: data['address-country'],
			province: data['address-province'],
			zip: data['address-zip'],
		},
		custom: parseCustomFields(formData),
		createdAt: today,
		updatedAt: today,
	};
	await db.companies.add(newCompany);

	return redirect('/companies');
}

export default function NewCompanyRoute() {
	const actionData = useActionData<typeof clientAction>();

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
