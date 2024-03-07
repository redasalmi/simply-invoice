import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { Eye, Pencil, Trash } from 'lucide-react';

import { buttonVariants } from '~/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table';

import { db, getPage } from '~/lib/db';
import { cn } from '~/lib/utils';

export async function clientLoader() {
	return {
		services: await getPage(db.services, 1),
	};
}

export function HydrateFallback() {
	return (
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
		</section>
	);
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
					{services && services.items.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Rate</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{services.items.map(({ id, name, rate }) => (
									<TableRow key={id}>
										<TableCell>{name}</TableCell>
										<TableCell>{rate}</TableCell>
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
