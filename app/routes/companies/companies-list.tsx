import { Outlet } from 'react-router';
import { CreateLink } from '~/components/CreateLink';
import { CompaniesList } from '~/components/company/CompaniesList';
import { getCompanies } from '~/queries/company.queries';
import type { Route } from './+types/companies-list';

export async function clientLoader() {
	return {
		companies: await getCompanies(),
	};
}

export default function CompaniesListRoute({
	loaderData,
}: Route.ComponentProps) {
	const companies = loaderData?.companies;

	return (
		<>
			<section>
				<div className="flex justify-end">
					<CreateLink to="/companies/new">Create Company</CreateLink>
				</div>
				<div className="mt-6">
					<CompaniesList companies={companies} />
				</div>
			</section>
			<Outlet />
		</>
	);
}
