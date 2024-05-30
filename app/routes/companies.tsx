import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { EntitiesList } from '~/components/Entities/list';
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
				<Link
					to="/companies/new"
					className={'rounded-lg bg-blue-300 px-4 py-2'}
				>
					Create New Company
				</Link>
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
					<Link
						to="/companies/new"
						className={'rounded-lg bg-blue-300 px-4 py-2'}
					>
						Create New Company
					</Link>
				</div>
				<div className="mt-6">
					<EntitiesList
						baseUrl="/companies"
						type="company"
						entities={companies}
					/>
				</div>
			</section>
			<Outlet />
		</>
	);
}
