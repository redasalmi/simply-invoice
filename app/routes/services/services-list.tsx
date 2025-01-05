import { Link, Outlet } from 'react-router';
import { EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { CreateLink } from '~/components/CreateLink';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table';
import { getServices } from '~/queries/service.queries';
import type { Route } from './+types/services-list';

export async function clientLoader() {
	return {
		services: await getServices(),
	};
}

export default function ServicesListRoute({
	loaderData,
}: Route.ComponentProps) {
	const services = loaderData?.services;

	return (
		<>
			<section>
				<div className="flex justify-end">
					<CreateLink to="/services/create">Create Service</CreateLink>
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
								{services.items.map(({ serviceId, name, rate }) => (
									<TableRow key={serviceId}>
										<TableCell>{name}</TableCell>
										<TableCell>{rate}</TableCell>
										<TableCell className="flex items-center gap-4">
											<Link
												to={`/services/detail/${serviceId}`}
												aria-label={`view ${name} service details`}
											>
												<EyeIcon />
											</Link>
											<Link
												to={`/services/update/${serviceId}`}
												aria-label={`update ${name} service`}
											>
												<PencilIcon />
											</Link>
											<Link
												to={`/services/delete/${serviceId}`}
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
