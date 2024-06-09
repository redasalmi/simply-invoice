import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { CreateEntityLink } from '~/components/entity/List';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table';
import { db, getPage } from '~/lib/db';

export async function clientLoader() {
	return {
		services: await getPage(db.services, 1),
	};
}

export function HydrateFallback() {
	return (
		<section>
			<div className="flex justify-end">
				<CreateEntityLink pathname="/services/new">
					Create New service
				</CreateEntityLink>
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
					<CreateEntityLink pathname="/services/new">
						Create New service
					</CreateEntityLink>
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
												<EyeIcon />
											</Link>
											<Link
												to={`/services/${id}/update`}
												aria-label={`update ${name} service`}
											>
												<PencilIcon />
											</Link>
											<Link
												to={`/services/${id}/delete`}
												aria-label={`delete ${name} service`}
											>
												<TrashIcon />
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
