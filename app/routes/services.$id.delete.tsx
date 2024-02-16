import {
	Form,
	redirect,
	useActionData,
	useLoaderData,
	useNavigate,
	useNavigation,
} from '@remix-run/react';
import type {
	ClientActionFunctionArgs,
	ClientLoaderFunctionArgs,
} from '@remix-run/react';
import invariant from 'tiny-invariant';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '~/components/ui';

import { servicesStore } from '~/lib/stores';
import type { Service } from '~/lib/types';

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
	invariant(params.id, 'Service ID is required');
	const serviceId = params.id;

	return {
		service: await servicesStore.getItem<Service>(serviceId),
	};
}

export async function clientAction({ params }: ClientActionFunctionArgs) {
	invariant(params.id, 'Service ID is required');

	try {
		const serviceId = params.id;
		const service = await servicesStore.getItem<Service>(serviceId);
		if (!service) {
			return {
				error: {
					message: 'No Service Found!',
					description: `Sorry but no service with this ID: ${serviceId} was found. Click the continue button to navigate back to your services list.`,
				},
			};
		}

		await servicesStore.removeItem(serviceId);

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

	const closeAlert = () => {
		navigate('/services');
	};

	return (
		<AlertDialog open>
			<AlertDialogContent>
				{!service ? (
					<>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{actionData?.error.message || 'Error Deleting Service!'}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{actionData?.error.description ||
									'An error happened while deleting your service, please try again later.'}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={closeAlert}>Close</AlertDialogCancel>
						</AlertDialogFooter>
					</>
				) : (
					<>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete the{' '}
								<span className="font-bold">{service.name}</span> service.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={closeAlert}>Cancel</AlertDialogCancel>
							<Form method="POST">
								<AlertDialogAction type="submit">
									{isLoading ? '...Deleting' : 'Delete'}
								</AlertDialogAction>
							</Form>
						</AlertDialogFooter>
					</>
				)}
			</AlertDialogContent>
		</AlertDialog>
	);
}
