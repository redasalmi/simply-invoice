import { useNavigate } from 'react-router';
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
import type * as Route from './+types.customer-detail';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const customerId = params.id;

	return {
		customer: await db.customers.get(customerId),
	};
}

export default function CustomerDetailRoute({
	loaderData,
}: Route.ComponentProps) {
	const navigate = useNavigate();

	const customer = loaderData?.customer;

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
