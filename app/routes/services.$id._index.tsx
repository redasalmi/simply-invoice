import {
	type ClientLoaderFunctionArgs,
	Link,
	useLoaderData,
	useNavigate,
} from '@remix-run/react';
import { Heading } from 'react-aria-components';
import invariant from 'tiny-invariant';
import { Modal } from '~/components/react-aria/modal';
import { Table, TableBody, TableCell, TableRow } from '~/components/ui/table';
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
		<Modal isOpen closeDialog={closeDialog}>
			{!service ? (
				<div>
					<Heading slot="title">No service found!</Heading>
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
					<Heading slot="title">Service Details</Heading>
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
		</Modal>
	);
}
