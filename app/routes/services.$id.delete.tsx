import {
	type ClientActionFunctionArgs,
	type ClientLoaderFunctionArgs,
	Form,
	redirect,
	useActionData,
	useLoaderData,
	useNavigate,
	useNavigation,
} from '@remix-run/react';
import invariant from 'tiny-invariant';
import { db } from '~/lib/db';
import {
	AlertDialogAction,
	AlertDialogActionButton,
	AlertDialogCancel,
	AlertDialogCancelButton,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogOverlay,
	AlertDialogPortal,
	AlertDialogRoot,
	AlertDialogTitle,
} from '~/components/ui/alert-dialog';

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
	invariant(params.id, 'Service ID is required');
	const serviceId = params.id;

	return {
		service: await db.services.get(serviceId),
	};
}

export async function clientAction({ params }: ClientActionFunctionArgs) {
	invariant(params.id, 'Service ID is required');

	try {
		const serviceId = params.id;
		const service = await db.services.get(serviceId);
		if (!service) {
			return {
				error: {
					message: 'No Service Found!',
					description: `Sorry but no service with this ID: ${serviceId} was found. Click the continue button to navigate back to your services list.`,
				},
			};
		}

		await db.services.delete(serviceId);

		return redirect('/services');
	} catch (err) {
		return {
			error: {
				message: 'Error Deleting the Service!',
				description:
					'An error happened while deleting your service, please try again later.',
			},
		};
	}
}

export default function ServiceDeleteRoute() {
	const { service } = useLoaderData<typeof clientLoader>();
	const actionData = useActionData<typeof clientAction>();
	const navigate = useNavigate();
	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	const closeAlert = () => {
		navigate('/services');
	};

	return (
		<AlertDialogRoot open>
			<AlertDialogPortal>
				<AlertDialogOverlay />
				<AlertDialogContent onEscapeKeyDown={closeAlert}>
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
								<AlertDialogCancel onClick={closeAlert} asChild>
									<AlertDialogCancelButton>Close</AlertDialogCancelButton>
								</AlertDialogCancel>
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
								<AlertDialogCancel
									disabled={isSubmitting}
									onClick={closeAlert}
									asChild
								>
									<AlertDialogCancelButton>Cancel</AlertDialogCancelButton>
								</AlertDialogCancel>
								<AlertDialogAction
									type="submit"
									disabled={isSubmitting}
									asChild
								>
									<Form method="POST">
										<AlertDialogActionButton>
											{isLoading ? '...Deleting' : 'Delete'}
										</AlertDialogActionButton>
									</Form>
								</AlertDialogAction>
							</div>
						</>
					)}
				</AlertDialogContent>
			</AlertDialogPortal>
		</AlertDialogRoot>
	);
}
