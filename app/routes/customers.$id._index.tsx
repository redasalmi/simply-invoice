import {
	type ClientLoaderFunctionArgs,
	useLoaderData,
	useNavigate,
} from '@remix-run/react';
import invariant from 'tiny-invariant';
import { EntityDetail } from '~/components/entity/Detail';
import { EntityNotFound } from '~/components/entity/Error';
import {
	DialogClose,
	DialogCloseButton,
	DialogContent,
	DialogOverlay,
	DialogPortal,
	DialogRoot,
	DialogTitle,
} from '~/components/ui/dialog';
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
		<DialogRoot open>
			<DialogPortal>
				<DialogOverlay />
				<DialogContent onEscapeKeyDown={closeDialog}>
					{!customer ? (
						<>
							<DialogTitle>No customer found!</DialogTitle>
							<EntityNotFound type="customer" baseUrl="/customers" />
						</>
					) : (
						<>
							<DialogTitle>Customer Details</DialogTitle>
							<EntityDetail entity={customer} />
						</>
					)}

					<DialogClose asChild onClick={closeDialog}>
						<DialogCloseButton />
					</DialogClose>
				</DialogContent>
			</DialogPortal>
		</DialogRoot>
	);
}
