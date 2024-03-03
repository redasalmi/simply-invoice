import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import type { ClientLoaderFunctionArgs } from '@remix-run/react';
import invariant from 'tiny-invariant';

import {
	Dialog,
	DialogContent,
	Table,
	TableBody,
	TableCell,
	TableRow,
} from '~/components/ui';

import { db } from '~/lib/db';

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
	invariant(params.id, 'Service ID is required');
	const serviceId = params.id;

	return {
		service: await db.services.get(serviceId),
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
									<TableCell>Rate:</TableCell>
									<TableCell>{service.rate}</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
