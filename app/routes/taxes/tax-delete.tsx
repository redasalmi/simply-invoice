import { Form, redirect, useNavigate, useNavigation } from 'react-router';
import { deleteTax, getTax } from '~/routes/taxes/queries/tax.queries';
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
import type { Route } from './+types/tax-delete';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const taxId = params.id;

	return {
		tax: await getTax(taxId),
	};
}

export async function clientAction({ params }: Route.ClientActionArgs) {
	try {
		const taxId = params.id;
		const tax = await getTax(taxId);
		if (!tax) {
			return {
				error: {
					message: 'No Tax Found!',
					description: `Sorry but no tax with this ID: ${taxId} was found. Click the continue button to navigate back to your taxes list.`,
				},
			};
		}

		await deleteTax(taxId);

		return redirect('/taxes');
	} catch {
		return {
			error: {
				message: 'Error Deleting the Tax!',
				description:
					'An error happened while deleting your tax, please try again later.',
			},
		};
	}
}

export default function TaxDeleteRoute({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const navigate = useNavigate();
	const navigation = useNavigation();

	const tax = loaderData?.tax;
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	const closeAlert = () => {
		navigate('/taxes');
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
					{!tax ? (
						<>
							<AlertDialogTitle>
								{actionData?.error?.message || 'Error Deleting Tax!'}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{actionData?.error?.description ||
									'An error happened while deleting your tax, please try again later.'}
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
								<span className="font-bold">{tax.name}</span> tax.{' '}
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
