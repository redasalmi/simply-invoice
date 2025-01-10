import { Form, redirect, useNavigate, useNavigation } from 'react-router';
import { deleteService, getService } from '~/queries/service.queries';
import {
	AlertDialogPopup,
	AlertDialogBackdrop,
	AlertDialogActionButton,
	AlertDialogCancelButton,
	AlertDialogDescription,
	AlertDialogRoot,
	AlertDialogTitle,
	AlertDialogPortal,
} from '~/components/ui/alert-dialog';
import type { Route } from './+types/service-delete';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const serviceId = params.id;

	return {
		service: await getService(serviceId),
	};
}

export async function clientAction({ params }: Route.ClientActionArgs) {
	try {
		const serviceId = params.id;
		const service = await getService(serviceId);
		if (!service) {
			return {
				error: {
					message: 'No Service Found!',
					description: `Sorry but no service with this ID: ${serviceId} was found. Click the continue button to navigate back to your services list.`,
				},
			};
		}

		await deleteService(serviceId);

		return redirect('/services');
	} catch {
		return {
			error: {
				message: 'Error Deleting the Service!',
				description:
					'An error happened while deleting your service, please try again later.',
			},
		};
	}
}

export default function ServiceDeleteRoute({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const navigate = useNavigate();
	const navigation = useNavigation();

	const service = loaderData?.service;
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	const closeAlert = () => {
		navigate('/services');
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Escape') {
			closeAlert();
		}
	};

	return (
		<AlertDialogRoot open>
			<AlertDialogPortal>
				<AlertDialogBackdrop />
				<AlertDialogPopup onKeyDown={handleKeyDown}>
					{!service ? (
						<>
							<AlertDialogTitle>
								{actionData?.error?.message || 'Error Deleting Service!'}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{actionData?.error?.description ||
									'An error happened while deleting your service, please try again later.'}
							</AlertDialogDescription>
							<div className="flex justify-end gap-[25px]">
								<AlertDialogCancelButton onClick={closeAlert}>
									Close
								</AlertDialogCancelButton>
							</div>
						</>
					) : (
						<>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete the{' '}
								<span className="font-bold">{service.name}</span> service.{' '}
							</AlertDialogDescription>
							<div className="flex justify-end gap-[25px]">
								<AlertDialogCancelButton
									disabled={isSubmitting}
									onClick={closeAlert}
								>
									Cancel
								</AlertDialogCancelButton>
								<Form method="POST">
									<AlertDialogActionButton
										type="submit"
										disabled={isSubmitting}
									>
										{isLoading ? '...Deleting' : 'Delete'}
									</AlertDialogActionButton>
								</Form>
							</div>
						</>
					)}
				</AlertDialogPopup>
			</AlertDialogPortal>
		</AlertDialogRoot>
	);
}
