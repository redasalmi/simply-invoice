import { Form, redirect, useNavigate, useNavigation } from 'react-router';
import {
	deleteCompany,
	getCompany,
} from '~/routes/companies/queries/company.queries';
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
import type { Route } from './+types/company-delete';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const companyId = params.id;

	return {
		company: await getCompany(companyId),
	};
}

export async function clientAction({ params }: Route.ClientActionArgs) {
	try {
		const companyId = params.id;
		const company = await getCompany(companyId);
		if (!company) {
			return {
				errors: {
					message: 'No Company Found!',
					description: `Sorry but no company with this ID: ${companyId} was found. Click the continue button to navigate back to your companies list.`,
				},
			};
		}

		await deleteCompany(companyId);

		return redirect('/companies');
	} catch {
		return {
			errors: {
				message: 'Error Deleting the Company!',
				description:
					'An error happened while deleting your company, please try again later.',
			},
		};
	}
}

export default function CompanyDeleteRoute({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const company = loaderData?.company;
	const errors = actionData?.errors;

	const navigate = useNavigate();
	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	const closeAlert = () => {
		navigate('/companies');
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
					{!company ? (
						<>
							<AlertDialogTitle>
								{errors?.message || `Error Deleting Company!`}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{errors?.description ||
									`An error happened while deleting your company, please try again later.`}
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
								<span className="font-bold">{company.name}</span> company.
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
