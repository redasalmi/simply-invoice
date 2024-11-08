import { Outlet } from 'react-router';
import { CreateLink } from '~/components/entity/CreateLink';
import { EntitiesList } from '~/components/entity/List';
import { getCompanies } from '~/queries/company.queries';
import type * as Route from './+types.companies-list';

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
					<EntitiesList
						type="company"
						baseUrl="/companies"
						entities={companies}
					/>
				</div>
			</section>
			<Outlet />
		</>
	);
}
