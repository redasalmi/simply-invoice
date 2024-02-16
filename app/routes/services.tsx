import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { Eye, Pencil, Trash } from 'lucide-react';

import {
	buttonVariants,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui';

import { getAllItems, servicesStore } from '~/lib/stores';
import type { Service } from '~/lib/types';
import { cn } from '~/lib/utils';

export async function clientLoader() {
	return {
		services: await getAllItems<Service>(servicesStore),
	};
}

export default function ServicesRoute() {
	const { services } = useLoaderData<typeof clientLoader>();

	return (
		<>
			<section>
				<div className="flex justify-end">
					<Link
						to="/services/new"
						className={cn(
							'rounded-lg bg-blue-300 px-4 py-2',
							buttonVariants({ variant: 'default' }),
						)}
					>
						Create New Service
					</Link>
				</div>
				<div className="mt-6">
					{services && services.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Price</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{services.map(({ id, name, price }) => (
									<TableRow key={id}>
										<TableCell>{name}</TableCell>
										<TableCell>{price}</TableCell>
										<TableCell className="flex items-center gap-4">
											<Link
												to={`/services/${id}`}
												aria-label={`view ${name} service details`}
											>
												<Eye />
											</Link>
											<Link
												to={`/services/${id}/update`}
												aria-label={`update ${name} service`}
											>
												<Pencil />
											</Link>
											<Link
												to={`/services/${id}/delete`}
												aria-label={`delete ${name} service`}
											>
												<Trash />
											</Link>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<p>No Service found.</p>
					)}
				</div>
			</section>
			<Outlet />
		</>
	);
}
