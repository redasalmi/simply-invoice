import {
	ClientActionFunctionArgs,
	ClientLoaderFunctionArgs,
	Form,
	redirect,
	useActionData,
	useLoaderData,
	useNavigate,
	useNavigation,
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

import { companiesStore } from '~/lib/stores';

import type { Company } from '~/types';

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
	const companyId = params.id;

	return {
		company: companyId
			? await companiesStore.getItem<Company>(companyId)
			: null,
	};
}

export async function clientAction({ params }: ClientActionFunctionArgs) {
	try {
		invariant(params.id, 'Company ID is required');

		const companyId = params.id;
		const company = await companiesStore.getItem<Company>(companyId);
		if (!company) {
			return {
				error: {
					message: 'No Company Found!',
					description: `Sorry but no company with this ID: ${companyId} was found. Click the continue button to navigate back to your companies list.`,
				},
			};
		}

		await companiesStore.removeItem(companyId);

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
