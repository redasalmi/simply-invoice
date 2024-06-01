import {
	type ClientLoaderFunctionArgs,
	useLoaderData,
	useNavigate,
} from '@remix-run/react';
import invariant from 'tiny-invariant';
import { EntityDetail } from '~/components/Entity/detail';
import { EntityNotFound } from '~/components/Entity/error';
import { Dialog, DialogContent } from '~/components/ui/dialog';
import { db } from '~/lib/db';

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
	invariant(params.id, 'Customer ID is required');
	const customerId = params.id;

	return {
		customer: await db.customers.get(customerId),
	};
}

export default function CustomerRoute() {
	const { customer } = useLoaderData<typeof clientLoader>();
	const navigate = useNavigate();

	const closeDialog = () => {
		navigate('/customers');
	};

	return (
		<Dialog open closeDialog={closeDialog}>
			<DialogContent>
				{!customer ? (
					<EntityNotFound type="customer" baseUrl="/customers" />
				) : (
					<EntityDetail entity={customer} />
				)}
			</DialogContent>
		</Dialog>
	);
}
