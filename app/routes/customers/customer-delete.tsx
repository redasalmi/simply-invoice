import { Form, redirect, useNavigate, useNavigation } from 'react-router';
import { deleteCustomer, getCustomer } from '~/queries/customer.queries';
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
import type { Route } from './+types/customer-delete';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const customerId = params.id;

	return {
		customer: await getCustomer(customerId),
	};
}

export async function clientAction({ params }: Route.ClientActionArgs) {
	try {
		const customerId = params.id;
		const customer = await getCustomer(customerId);
		if (!customer) {
			return {
				errors: {
					message: 'No Customer Found!',
					description: `Sorry but no customer with this ID: ${customerId} was found. Click the continue button to navigate back to your customers list.`,
				},
			};
		}

		await deleteCustomer(customerId);

		return redirect('/customers');
	} catch {
		return {
			errors: {
				message: 'Error Deleting the Customer!',
				description:
					'An error happened while deleting your customer, please try again later.',
			},
		};
	}
}

export default function CustomerDeleteRoute({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const customer = loaderData?.customer;
	const errors = actionData?.errors;

	const navigate = useNavigate();
	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	const closeAlert = () => {
		navigate('/customers');
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
					{!customer ? (
						<>
							<AlertDialogTitle>
								{errors?.message || `Error Deleting Customer!`}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{errors?.description ||
									`An error happened while deleting your customer, please try again later.`}
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
								<span className="font-bold">{customer.name}</span> customer.
							</AlertDialogDescription>
							<div className="flex justify-end gap-[25px]">
								<AlertDialogCancelButton
									disabled={isSubmitting}
									onClick={closeAlert}
								>
									Cancel
								</AlertDialogCancelButton>
								<Form method="POST">
									<AlertDialogActionButton type="submit">
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
