import { Link, useLoaderData, useNavigate } from '@remix-run/react';

import {
	Dialog,
	DialogContent,
	Table,
	TableBody,
	TableCell,
	TableRow,
} from '~/components/ui';
import { customersStore } from '~/lib/stores';

import type { ClientLoaderFunctionArgs } from '@remix-run/react';
import type { Customer } from '~/lib/types';
import invariant from 'tiny-invariant';

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
	invariant(params.id, 'Customer ID is required');
	const customerId = params.id;

	return {
		customer: await customersStore.getItem<Customer>(customerId),
	};
}

export default function CustomerRoute() {
	const { customer } = useLoaderData<typeof clientLoader>();
	const navigate = useNavigate();

	const closeDialog = () => {
		navigate('/customers');
	};

	return (
		<Dialog open onOpenChange={closeDialog}>
			<DialogContent className="h-full max-h-[80%] max-w-[80%]">
				{!customer ? (
					<div>
						<p className="m-12">
							Sorry, but no customer with this ID was found! Please click{' '}
							<Link
								to="/customers"
								aria-label="customers list"
								className="hover:underline"
							>
								Here
							</Link>{' '}
							to navigate back to your customers list.
						</p>
					</div>
				) : (
					<>
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

						{customer.custom?.length ? (
							<div>
								<p>Custom Fields:</p>
								<Table>
									<TableBody>
										{customer.custom.map((field) => (
											<TableRow key={field.id}>
												<TableCell>{field.label}:</TableCell>
												<TableCell>{field.content}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						) : null}
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
