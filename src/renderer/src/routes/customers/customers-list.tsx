import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import {
	Link,
	type LoaderFunctionArgs,
	Outlet,
	useLoaderData,
} from "react-router";
import { CreateLink } from "~/renderer/components/CreateLink";
import { Pagination } from "~/renderer/components/Pagination";
import { Table } from "~/renderer/components/ui/table";
import { getPaginationParams } from "~/renderer/utils/getPaginationParams";

export async function customersListLoader({ request }: LoaderFunctionArgs) {
	const { cursor, paginationType } = getPaginationParams(request.url);

	return {
		customers: await window.api.db.customers.get(cursor, paginationType),
	};
}

export function CustomersListRoute() {
	const { customers } = useLoaderData<typeof customersListLoader>();

	return (
		<>
			<section>
				<div className="flex items-center justify-between">
					{customers.total ? <p>Total customers: {customers.total}</p> : null}
					<CreateLink to="/customers/create">Create Customer</CreateLink>
				</div>
				<div className="mt-6">
					{customers && customers.items.length > 0 ? (
						<>
							<Table>
								<Table.Header>
									<Table.Row>
										<Table.Head>Name</Table.Head>
										<Table.Head>Email</Table.Head>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{customers.items.map(({ customerId, email, name }) => (
										<Table.Row key={customerId}>
											<Table.Cell>{name}</Table.Cell>
											<Table.Cell>{email}</Table.Cell>
											<Table.Cell className="flex items-center gap-4">
												<Link
													aria-label={`view ${name} customer details`}
													to={`/customers/detail/${customerId}`}
												>
													<EyeIcon />
												</Link>
												<Link
													aria-label={`edit ${name} customer details`}
													to={`/customers/update/${customerId}`}
												>
													<PencilIcon />
												</Link>
												<Link
													aria-label={`delete ${name} customer`}
													to={`/customers/delete/${customerId}`}
												>
													<TrashIcon />
												</Link>
											</Table.Cell>
										</Table.Row>
									))}
								</Table.Body>
							</Table>
							{/* TODO: remove this once we have a proper pagination */}
							{customers.total > 10 ? (
								<Pagination
									baseUrl="/customers"
									pageInfo={customers.pageInfo}
								/>
							) : null}
						</>
					) : (
						<p>No customers found.</p>
					)}
				</div>
			</section>
			<Outlet />
		</>
	);
}
