import { Outlet, useLoaderData } from '@remix-run/react';
import { CreateEntityLink, EntitiesList } from '~/components/entity/List';
import { db, getPage } from '~/lib/db';

export async function clientLoader() {
	return {
		customers: await getPage(db.customers, 1),
	};
}

export function HydrateFallback() {
	return (
		<section>
			<div className="flex justify-end">
				<CreateEntityLink pathname="/customers/new">
					Create New Customer
				</CreateEntityLink>
			</div>
		</section>
	);
}

export default function CustomersRoute() {
	const { customers } = useLoaderData<typeof clientLoader>();

	return (
		<>
			<section>
				<div className="flex justify-end">
					<CreateEntityLink pathname="/customers/new">
						Create New Customer
					</CreateEntityLink>
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
