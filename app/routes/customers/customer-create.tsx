import { redirect, useNavigation } from 'react-router';
import { ulid } from 'ulid';
import { CreateEntityForm } from '~/components/entity/Create';
import { useForm } from '~/hooks/useForm';
import { db } from '~/lib/db';
import { entityFormSchema } from '~/schemas/entity.schemas';
import type { Customer } from '~/types/customer.types';
import { parseCustomFields } from '~/utils/parseCustomFields.utils';
import { parseFormData } from '~/utils/parseForm.utils';
import type * as Route from './+types.customer-create';

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const { data, errors } = parseFormData(formData, entityFormSchema);

	if (errors) {
		return {
			errors,
		};
	}

	const today = new Date().toISOString();
	const newCustomer: Customer = {
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
	await db.customers.add(newCustomer);

	return redirect('/customers');
}

export default function CustomerCreateRoute({
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
				type="customer"
				isSubmitting={isSubmitting}
				isLoading={isLoading}
				errors={errors}
				handleSubmit={handleSubmit}
			/>
		</section>
	);
}
