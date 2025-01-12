import { useNavigate } from 'react-router';
import {
	DialogClose,
	DialogPopup,
	DialogOverlay,
	DialogPortal,
	DialogRoot,
	DialogTitle,
} from '~/components/ui/dialog';
import { getCustomer } from '~/routes/customers/queries/customer.queries';
import { Table, TableBody, TableCell, TableRow } from '~/components/ui/table';
import { CustomerNotFound } from '~/routes/customers/components/CustomerNotFound';
import type { Route } from './+types/customer-detail';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const customerId = params.id;

	return {
		customer: await getCustomer(customerId),
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

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Escape') {
			closeDialog();
		}
	};

	return (
		<DialogRoot open>
			<DialogPortal>
				<DialogOverlay />
				<DialogPopup onKeyDown={handleKeyDown}>
					<DialogTitle>
						{!customer ? 'No customer found!' : 'Customer Details'}
					</DialogTitle>

					{!customer ? (
						<CustomerNotFound />
					) : (
						<div>
							<div>
								<Table>
									<TableBody>
										<TableRow>
											<TableCell>Name:</TableCell>
											<TableCell>{customer.name}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Email:</TableCell>
											<TableCell>{customer.email}</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</div>

							<div>
								<p>Address:</p>
								<Table>
									<TableBody>
										<TableRow>
											<TableCell>Address 1:</TableCell>
											<TableCell>{customer.address.address1}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Address 2:</TableCell>
											<TableCell>{customer.address.address2}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Country:</TableCell>
											<TableCell>{customer.address.country}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Province:</TableCell>
											<TableCell>{customer.address.province}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>City:</TableCell>
											<TableCell>{customer.address.city}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Zip:</TableCell>
											<TableCell>{customer.address.zip}</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</div>
						</div>
					)}

					<DialogClose onClick={closeDialog} />
				</DialogPopup>
			</DialogPortal>
		</DialogRoot>
	);
}
