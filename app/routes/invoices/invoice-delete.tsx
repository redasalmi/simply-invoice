import { Form, redirect, useNavigate, useNavigation } from 'react-router';
import { deleteInvoice, getInvoice } from '~/queries/invoice.queries';
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
import type { Route } from './+types/invoice-delete';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const invoiceId = params.id;

	return {
		invoice: await getInvoice(invoiceId),
	};
}

export async function clientAction({ params }: Route.ClientActionArgs) {
	try {
		const invoiceId = params.id;
		const invoice = await getInvoice(invoiceId);
		if (!invoice) {
			return {
				errors: {
					message: 'No Invoice Found!',
					description: `Sorry but no invoice with this ID: ${invoiceId} was found. Click the continue button to navigate back to your invoices list.`,
				},
			};
		}

		await deleteInvoice(invoiceId);

		return redirect('/invoices');
	} catch (err) {
		console.log(err);

		return {
			errors: {
				message: 'Error Deleting the Invoice!',
				description:
					'An error happened while deleting your invoice, please try again later.',
			},
		};
	}
}

export default function InvoiceDeleteRoute({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const invoice = loaderData?.invoice;
	const errors = actionData?.errors;

	const navigate = useNavigate();
	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	const closeAlert = () => {
		navigate('/invoices');
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
					{!invoice ? (
						<>
							<AlertDialogTitle>
								{errors?.message || `Error Deleting Invoice!`}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{errors?.description ||
									`An error happened while deleting your invoice, please try again later.`}
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
								This action cannot be undone. This will permanently delete the
								invoice.
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
