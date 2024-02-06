import { Link, useLoaderData } from '@remix-run/react';

import {
	buttonVariants,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui';
import { servicesStore, getAllItems } from '~/lib/stores';
import { cn } from '~/lib/utils';

import type { Service } from '~/types';

export async function clientLoader() {
	return {
		services: await getAllItems<Service>(servicesStore),
	};
}

export default function ServicesRoute() {
	const { services } = useLoaderData<typeof clientLoader>();

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
			<div className="mt-6">
				{services && services.length > 0 ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{services.map(({ id, name }) => (
								<TableRow key={id}>
									<TableCell>{name}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<p>No Service found.</p>
				)}
			</div>
		</section>
	);
}
