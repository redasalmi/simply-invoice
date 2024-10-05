import { Outlet } from 'react-router';
import { CreateLink } from '~/components/entity/CreateLink';
import { EntitiesList } from '~/components/entity/List';
import { db, getPage } from '~/lib/db';
import type * as Route from './+types.customers-list';

export async function clientLoader() {
	return {
		customers: await getPage(db.customers, 1),
	};
}

export function HydrateFallback() {
	return (
		<section>
			<div className="flex justify-end">
				<CreateLink to="/customers/new">Create Customer</CreateLink>
			</div>
		</section>
	);
}

export default function CustomersListRoute({
	loaderData,
}: Route.ComponentProps) {
	const customers = loaderData?.customers;

	return (
		<>
			<section>
				<div className="flex justify-end">
					<CreateLink to="/customers/new">Create Customer</CreateLink>
				</div>
				<div className="mt-6">
					<EntitiesList
						type="customer"
						baseUrl="/customers"
						entities={customers}
					/>
				</div>
			</section>
			<Outlet />
		</>
	);
}