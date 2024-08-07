import { Outlet, useLoaderData } from '@remix-run/react';
import { CreateLink } from '~/components/entity/CreateLink';
import { EntitiesList } from '~/components/entity/List';
import { db, getPage } from '~/lib/db';

export async function clientLoader() {
	return {
		companies: await getPage(db.companies, 1),
	};
}

export function HydrateFallback() {
	return (
		<section>
			<div className="flex justify-end">
				<CreateLink to="/companies/new">Create New Company</CreateLink>
			</div>
		</section>
	);
}

export default function CompaniesRoute() {
	const { companies } = useLoaderData<typeof clientLoader>();

	return (
		<>
			<section>
				<div className="flex justify-end">
					<CreateLink to="/companies/new">Create New Company</CreateLink>
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
