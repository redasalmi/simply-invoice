import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import {
	Link,
	type LoaderFunctionArgs,
	Outlet,
	useLoaderData,
} from "react-router";
import { CreateLink } from "~/renderer/components/CreateLink";
import { Pagination } from "~/renderer/components/Pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/renderer/components/ui/table";
import { getPaginationParams } from "~/renderer/utils/getPaginationParams";

export async function companiesListLoader({ request }: LoaderFunctionArgs) {
	const { cursor, paginationType } = getPaginationParams(request.url);

	return {
		companies: await window.api.db.companies.get(cursor, paginationType),
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
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Email</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{companies.items.map(({ companyId, email, name }) => (
										<TableRow key={companyId}>
											<TableCell>{name}</TableCell>
											<TableCell>{email}</TableCell>
											<TableCell className="flex items-center gap-4">
												<Link
													to={`/companies/detail/${companyId}`}
													aria-label={`view ${name} company details`}
												>
													<EyeIcon />
												</Link>
												<Link
													to={`/companies/update/${companyId}`}
													aria-label={`update ${name} company`}
												>
													<PencilIcon />
												</Link>
												<Link
													to={`/companies/delete/${companyId}/`}
													aria-label={`delete ${name} company`}
												>
													<TrashIcon />
												</Link>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							{/* TODO: remove this once we have a proper pagination */}
							{companies.total > 10 ? (
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
