import {
	type ClientActionFunctionArgs,
	type ClientLoaderFunctionArgs,
	redirect,
	useActionData,
	useLoaderData,
	useNavigate,
	useNavigation,
} from '@remix-run/react';
import invariant from 'tiny-invariant';
import { DeleteEntity, DeleteEntityError } from '~/components/Entity/delete';
import { db } from '~/lib/db';

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
	invariant(params.id, 'Customer ID is required');
	const customerId = params.id;

	return {
		customer: await db.customers.get(customerId),
	};
}

export async function clientAction({ params }: ClientActionFunctionArgs) {
	invariant(params.id, 'Customer ID is required');

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

export default function CustomerDeleteRoute() {
	const { customer } = useLoaderData<typeof clientLoader>();
	const actionData = useActionData<typeof clientAction>();
	const navigate = useNavigate();
	const navigation = useNavigation();
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
