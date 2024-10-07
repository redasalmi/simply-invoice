import { Link, useNavigate } from 'react-router';
import {
	DialogClose,
	DialogCloseButton,
	DialogContent,
	DialogOverlay,
	DialogPortal,
	DialogRoot,
	DialogTitle,
} from '~/components/ui/dialog';
import { Table, TableBody, TableCell, TableRow } from '~/components/ui/table';
import { db } from '~/lib/db';
import type * as Route from './+types.service-detail';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const serviceId = params.id;

	return {
		service: await db.services.get(serviceId),
	};
}

export default function ServiceDetailRoute({
	loaderData,
}: Route.ComponentProps) {
	const navigate = useNavigate();

	const service = loaderData?.service;

	const closeDialog = () => {
		navigate('/services');
	};

	return (
		<DialogRoot open>
			<DialogPortal>
				<DialogOverlay />
				<DialogContent onEscapeKeyDown={closeDialog}>
					{!service ? (
						<>
							<DialogTitle>No service found!</DialogTitle>
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
						</>
					) : (
						<>
							<DialogTitle>Service details</DialogTitle>
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
						</>
					)}

					<DialogClose asChild onClick={closeDialog}>
						<DialogCloseButton />
					</DialogClose>
				</DialogContent>
			</DialogPortal>
		</DialogRoot>
	);
}
