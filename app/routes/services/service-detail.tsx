import { Link, useNavigate } from 'react-router';
import {
	DialogClose,
	DialogPopup,
	DialogOverlay,
	DialogPortal,
	DialogRoot,
	DialogTitle,
} from '~/components/ui/dialog';
import { Table, TableBody, TableCell, TableRow } from '~/components/ui/table';
import { getService } from '~/routes/services/queries/service.queries';
import type { Route } from './+types/service-detail';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const serviceId = params.id;

	return {
		service: await getService(serviceId),
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

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Escape') {
			closeDialog();
		}
	};

	return (
		<DialogRoot open>
			<DialogPortal>
				<DialogOverlay />
				<DialogPopup onKeyDown={handleKeyDown}>
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
									{service.description ? (
										<TableRow>
											<TableCell>Description:</TableCell>
											<TableCell>{service.description}</TableCell>
										</TableRow>
									) : null}
									<TableRow>
										<TableCell>Rate:</TableCell>
										<TableCell>{service.rate}</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</>
					)}

					<DialogClose onClick={closeDialog} />
				</DialogPopup>
			</DialogPortal>
		</DialogRoot>
	);
}
