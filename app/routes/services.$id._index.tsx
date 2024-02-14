import { Link, useLoaderData, useNavigate } from '@remix-run/react';

import {
	Dialog,
	DialogContent,
	Table,
	TableBody,
	TableCell,
	TableRow,
} from '~/components/ui';
import { servicesStore } from '~/lib/stores';

import type { ClientLoaderFunctionArgs } from '@remix-run/react';
import type { Service } from '~/types';

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
	const serviceId = params.id;

	return {
		service: serviceId ? await servicesStore.getItem<Service>(serviceId) : null,
	};
}

export default function ServiceRoute() {
	const { service } = useLoaderData<typeof clientLoader>();
	const navigate = useNavigate();

	const closeDialog = () => {
		navigate('/services');
	};

	return (
		<Dialog open onOpenChange={closeDialog}>
			<DialogContent className="h-full max-h-[80%] max-w-[80%]">
				{!service ? (
					<div>
						<p className="m-12">
							Sorry, but no service with this ID was found! Please click{' '}
							<Link
								to="/services"
								aria-label="services list"
								className="hover:underline"
							>
								Here
							</Link>{' '}
							to navigate back to your services list.
						</p>
					</div>
				) : (
					<div>
						<Table>
							<TableBody>
								<TableRow>
									<TableCell>Name:</TableCell>
									<TableCell>{service.name}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Description:</TableCell>
									<TableCell>{service.description}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Price:</TableCell>
									<TableCell>{service.price}</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
