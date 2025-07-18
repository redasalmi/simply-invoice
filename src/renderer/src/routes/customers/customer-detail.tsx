import {
	Link,
	type LoaderFunctionArgs,
	useLoaderData,
	useNavigate,
} from "react-router";
import invariant from "tiny-invariant";
import * as Dialog from "~/renderer/components/ui/dialog";
import * as Table from "~/renderer/components/ui/table";

export async function customerDetailLoader({ params }: LoaderFunctionArgs) {
	const customerId = params.customerId;
	invariant(customerId, "Customer ID is required");

	return {
		customer: await window.api.db.customers.getById(customerId),
	};
}

export function CustomerDetailRoute() {
	const navigate = useNavigate();
	const { customer } = useLoaderData<typeof customerDetailLoader>();

	const closeDialog = () => {
		navigate("/customers");
	};

	return (
		<Dialog.Root closeDialog={closeDialog} open>
			<Dialog.CloseButton autoFocus onClick={closeDialog} />

			{!customer ? (
				<>
					<Dialog.Title>No customer found!</Dialog.Title>
					<Dialog.Description>
						<p>
							Sorry, but no customer with this ID was found! Please click{" "}
							<Link
								aria-label="customers list"
								className="hover:underline"
								to="/customers"
							>
								Here
							</Link>
						</p>
					</Dialog.Description>
				</>
			) : (
				<>
					<Dialog.Title>Customer details</Dialog.Title>
					<Dialog.Description>
						<Table.Root>
							<Table.Body>
								<Table.Row>
									<Table.Cell>Name:</Table.Cell>
									<Table.Cell>{customer.name}</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>Email:</Table.Cell>
									<Table.Cell>{customer.email}</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>Address 1:</Table.Cell>
									<Table.Cell>{customer.address.address1}</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>Address 2:</Table.Cell>
									<Table.Cell>{customer.address.address2}</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>City:</Table.Cell>
									<Table.Cell>{customer.address.city}</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>Country:</Table.Cell>
									<Table.Cell>{customer.address.country}</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>Province:</Table.Cell>
									<Table.Cell>{customer.address.province}</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>Zip:</Table.Cell>
									<Table.Cell>{customer.address.zip}</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table.Root>
					</Dialog.Description>
				</>
			)}
		</Dialog.Root>
	);
}
