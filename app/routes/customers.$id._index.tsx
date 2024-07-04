import {
	type ClientLoaderFunctionArgs,
	useLoaderData,
	useNavigate,
} from '@remix-run/react';
import { Heading } from 'react-aria-components';
import invariant from 'tiny-invariant';
import { EntityDetail } from '~/components/entity/Detail';
import { EntityNotFound } from '~/components/entity/Error';
import { Modal } from '~/components/react-aria/modal';
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
		<Modal isOpen closeDialog={closeDialog}>
			{!customer ? (
				<>
					<Heading slot="title">No customer found</Heading>
					<EntityNotFound type="customer" baseUrl="/customers" />
				</>
			) : (
				<>
					<Heading slot="title">Customer Details</Heading>
					<EntityDetail entity={customer} />
				</>
			)}
		</Modal>
	);
}
