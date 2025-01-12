import { Outlet, Link } from 'react-router';
import { EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { CreateLink } from '~/components/CreateLink';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table';
import { getCompanies } from '~/routes/companies/queries/company.queries';
import { Pagination } from '~/components/Pagination';
import { getPaginationParams, itemsPerPage } from '~/lib/pagination';
import type { Route } from './+types/companies-list';

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
	const { cursor, paginationType } = getPaginationParams(request.url);

	return {
		companies: await getCompanies(cursor, paginationType), // TODO: remove additional_information if not needed in list
	};
}

export default function CompaniesListRoute({
	loaderData,
}: Route.ComponentProps) {
	const companies = loaderData?.companies;

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
							{companies.total > itemsPerPage ? (
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
