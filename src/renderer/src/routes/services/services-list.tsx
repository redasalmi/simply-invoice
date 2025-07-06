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
import { userSettingsContext } from "~/renderer/routes";
import { getPaginationParams } from "~/renderer/utils/getPaginationParams";

export async function servicesListLoader({
	request,
	context,
}: LoaderFunctionArgs) {
	const userSettings = context.get(userSettingsContext);
	const { cursor, paginationType, itemsPerPage } = getPaginationParams(
		request.url,
		userSettings?.get("services-table-items-per-page"),
	);

	return {
		services: await window.api.db.services.get(
			cursor,
			paginationType,
			itemsPerPage,
		),
	};
}

export function ServicesListRoute() {
	const { services } = useLoaderData<typeof servicesListLoader>();

	return (
		<>
			<section>
				<div className="flex items-center justify-between">
					{services.total ? <p>Total services: {services.total}</p> : null}
					<CreateLink to="/services/create">Create Service</CreateLink>
				</div>
				<div className="mt-6">
					{services && services.items.length > 0 ? (
						<>
							<Table>
								<Table.Header>
									<Table.Row>
										<Table.Head>Name</Table.Head>
										<Table.Head>Rate (%)</Table.Head>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{services.items.map(({ serviceId, name, rate }) => (
										<Table.Row key={serviceId}>
											<Table.Cell>{name}</Table.Cell>
											<Table.Cell>{rate}</Table.Cell>
											<Table.Cell className="flex items-center gap-4">
												<Link
													aria-label={`view ${name} service details`}
													to={`/services/detail/${serviceId}`}
												>
													<EyeIcon />
												</Link>
												<Link
													aria-label={`update ${name} service`}
													to={`/services/update/${serviceId}`}
												>
													<PencilIcon />
												</Link>
												<Link
													aria-label={`delete ${name} service`}
													to={`/services/delete/${serviceId}`}
												>
													<TrashIcon />
												</Link>
											</Table.Cell>
										</Table.Row>
									))}
								</Table.Body>
							</Table>
							{services.total > services.itemsPerPage ? (
								<Pagination baseUrl="/services" pageInfo={services.pageInfo} />
							) : null}
						</>
					) : (
						<p>No Service found.</p>
					)}
				</div>
			</section>
			<Outlet />
		</>
	);
}
