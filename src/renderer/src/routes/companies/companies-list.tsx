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

export async function companiesListLoader({
	request,
	context,
}: LoaderFunctionArgs) {
	const userSettings = context.get(userSettingsContext);
	const { cursor, paginationType, itemsPerPage } = getPaginationParams(
		request.url,
		userSettings?.get("companies-table-items-per-page"),
	);

	return {
		companies: await window.api.db.companies.get(
			cursor,
			paginationType,
			itemsPerPage,
		),
	};
}

export function CompaniesListRoute() {
	const { companies } = useLoaderData<typeof companiesListLoader>();

	return (
		<>
			<section>
				<div className="flex items-center justify-between">
					{companies.total ? <p>Total companies: {companies.total}</p> : null}
					<CreateLink to="/companies/create">Create Company</CreateLink>
				</div>
				<div className="mt-6">
					{companies && companies.items.length > 0 ? (
						<>
							<Table>
								<Table.Header>
									<Table.Row>
										<Table.Head>Name</Table.Head>
										<Table.Head>Email</Table.Head>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{companies.items.map(({ companyId, email, name }) => (
										<Table.Row key={companyId}>
											<Table.Cell>{name}</Table.Cell>
											<Table.Cell>{email}</Table.Cell>
											<Table.Cell className="flex items-center gap-4">
												<Link
													aria-label={`view ${name} company details`}
													to={`/companies/detail/${companyId}`}
												>
													<EyeIcon />
												</Link>
												<Link
													aria-label={`update ${name} company`}
													to={`/companies/update/${companyId}`}
												>
													<PencilIcon />
												</Link>
												<Link
													aria-label={`delete ${name} company`}
													to={`/companies/delete/${companyId}/`}
												>
													<TrashIcon />
												</Link>
											</Table.Cell>
										</Table.Row>
									))}
								</Table.Body>
							</Table>
							{companies.total > companies.itemsPerPage ? (
								<Pagination
									baseUrl="/companies"
									pageInfo={companies.pageInfo}
								/>
							) : null}
						</>
					) : (
						<p>No companies found.</p>
					)}
				</div>
			</section>
			<Outlet />
		</>
	);
}
