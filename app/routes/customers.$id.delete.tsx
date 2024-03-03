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

import { db } from '~/lib/db';

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
	invariant(params.id, 'Customer ID is required');
	const customerId = params.id;

	return {
		customer: await db.customers.get(customerId),
	};
}

export async function clientAction({ params }: ClientActionFunctionArgs) {
	invariant(params.id, 'Customer ID is required');

	try {
		const customerId = params.id;
		const customer = await db.customers.get(customerId);
		if (!customer) {
			return {
				error: {
					message: 'No Customer Found!',
					description: `Sorry but no customer with this ID: ${customerId} was found. Click the continue button to navigate back to your customers list.`,
				},
			};
		}

		await db.customers.delete(customerId);

		return redirect('/customers');
	} catch (err) {
		return {
			error: {
				message: 'Error Deleting the Customer!',
				description:
					'An error happened while deleting your customer, please try again later.',
			},
		};
	}
}

export default function CustomerDeleteRoute() {
	const { customer } = useLoaderData<typeof clientLoader>();
	const actionData = useActionData<typeof clientAction>();
	const navigate = useNavigate();
	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';

	const closeAlert = () => {
		navigate('/customers');
	};

	return (
		<AlertDialog open>
			<AlertDialogContent>
				{!customer ? (
					<>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{actionData?.error.message || 'Error Deleting Customer!'}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{actionData?.error.description ||
									'An error happened while deleting your customer, please try again later.'}
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
								<span className="font-bold">{customer.name}</span> customer.
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
