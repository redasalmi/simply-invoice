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
} from '~/components/ui/alert-dialog';

import { db } from '~/lib/db';

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
	invariant(params.id, 'Company ID is required');
	const companyId = params.id;

	return {
		company: await db.companies.get(companyId),
	};
}

export async function clientAction({ params }: ClientActionFunctionArgs) {
	invariant(params.id, 'Company ID is required');

	try {
		const companyId = params.id;
		const company = await db.companies.get(companyId);
		if (!company) {
			return {
				error: {
					message: 'No Company Found!',
					description: `Sorry but no company with this ID: ${companyId} was found. Click the continue button to navigate back to your companies list.`,
				},
			};
		}

		await db.companies.delete(companyId);

		return redirect('/companies');
	} catch (err) {
		return {
			error: {
				message: 'Error Deleting the Company!',
				description:
					'An error happened while deleting your company, please try again later.',
			},
		};
	}
}

export default function CompanyDeleteRoute() {
	const { company } = useLoaderData<typeof clientLoader>();
	const actionData = useActionData<typeof clientAction>();
	const navigate = useNavigate();
	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';

	const closeAlert = () => {
		navigate('/companies');
	};

	return (
		<AlertDialog open>
			<AlertDialogContent>
				{!company ? (
					<>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{actionData?.error.message || 'Error Deleting Company!'}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{actionData?.error.description ||
									'An error happened while deleting your company, please try again later.'}
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
								<span className="font-bold">{company.name}</span> company.
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
