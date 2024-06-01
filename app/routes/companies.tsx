import { Outlet, useLoaderData } from '@remix-run/react';
import { CreateEntityLink, EntitiesList } from '~/components/Entity/list';
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
				<CreateEntityLink pathname="/companies/new">
					Create New Company
				</CreateEntityLink>
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
					<CreateEntityLink pathname="/companies/new">
						Create New Company
					</CreateEntityLink>
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
