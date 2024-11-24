import { redirect, useNavigation } from 'react-router';
import { db } from '~/lib/db';
import { UpdateEntityForm } from '~/components/entity/Update';
import { EntityNotFound } from '~/components/entity/Error';
import { parseCustomFields } from '~/utils/parseCustomFields.utils';
import { entityFormSchema } from '~/schemas/entity.schemas';
import { parseFormData } from '~/utils/parseForm.utils';
import type { UpdateCustomer } from '~/types/customer.types';
import { useForm } from '~/hooks/useForm';
import type { Route } from './+types/customer-update';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const customerId = params.id;

	return {
		customer: await db.customers.get(customerId),
	};
}

export async function clientAction({
	params,
	request,
}: Route.ClientActionArgs) {
	const customerId = params.id;

	const formData = await request.formData();
	const { data, errors } = parseFormData(formData, entityFormSchema);

	if (errors) {
		return {
			errors,
		};
	}

	const today = new Date().toISOString();
	const updatedCustomer = {
		custom: parseCustomFields(formData),
		updatedAt: today,
	} as UpdateCustomer;

	for (const key in data) {
		if (key.includes('custom')) {
			continue;
		}

		updatedCustomer[key.replace('-', '.') as keyof UpdateCustomer] =
			data[key as keyof typeof data];
	}
	await db.customers.update(customerId, updatedCustomer);

	return redirect('/customers');
}

export default function CustomerUpdateRoute({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const navigation = useNavigation();

	const customer = loaderData?.customer;
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	const { errors, handleSubmit } = useForm({
		schema: entityFormSchema,
		actionErrors: actionData?.errors,
	});

	if (!customer) {
		return (
			<section>
				<EntityNotFound type="customer" baseUrl="/customers" />
			</section>
		);
	}

	return (
		<section>
			<UpdateEntityForm
				type="customer"
				entity={customer}
				isLoading={isLoading}
				isSubmitting={isSubmitting}
				errors={errors}
				handleSubmit={handleSubmit}
			/>
		</section>
	);
}
