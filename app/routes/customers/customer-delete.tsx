import { redirect, useNavigate, useNavigation } from 'react-router';
import { DeleteEntity, DeleteEntityError } from '~/components/entity/Delete';
import { db } from '~/lib/db';
import type * as Route from './+types.customer-delete';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const customerId = params.id;

	return {
		customer: await db.customers.get(customerId),
	};
}

export async function clientAction({ params }: Route.ClientActionArgs) {
	try {
		const customerId = params.id;
		const customer = await db.customers.get(customerId);
		if (!customer) {
			return {
				error: {
					message: 'No Customer Found!',
					description: `Sorry but no customer with this ID: ${customerId} was found. Click the continue button to navigate back to your customers list.`,
				},
			};
		}

		await db.customers.delete(customerId);

		return redirect('/customers');
	} catch (err) {
		return {
			error: {
				message: 'Error Deleting the Customer!',
				description:
					'An error happened while deleting your customer, please try again later.',
			},
		};
	}
}

export default function CustomerDeleteRoute({
	loaderData,
}: Route.ComponentProps) {
	const navigate = useNavigate();
	const navigation = useNavigation();

	const customer = loaderData?.customer;
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	const closeAlert = () => {
		navigate('/customers');
	};

	if (!customer) {
		return (
			<DeleteEntityError
				type="customer"
				error={actionData?.error}
				closeAlert={closeAlert}
			/>
		);
	}

	return (
		<DeleteEntity
			type="customer"
			entityName={customer.name}
			isLoading={isLoading}
			isSubmitting={isSubmitting}
			closeAlert={closeAlert}
		/>
	);
}
