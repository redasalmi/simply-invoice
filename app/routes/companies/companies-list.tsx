import { Outlet } from 'react-router';
import { CreateLink } from '~/components/entity/CreateLink';
import { EntitiesList } from '~/components/entity/List';
import { db, getPage } from '~/lib/db';
import type * as Route from './+types.companies-list';

export async function clientLoader() {
	return {
		companies: await getPage(db.companies, 1),
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
