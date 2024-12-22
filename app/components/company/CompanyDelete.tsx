import { Form } from 'react-router';
import {
	AlertDialogPopup,
	AlertDialogBackdrop,
	AlertDialogActionButton,
	AlertDialogCancelButton,
	AlertDialogDescription,
	AlertDialogRoot,
	AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import type { Company } from '~/types';

type CompanyDeleteProps = {
	company?: Company;
	errors?: any;
	isLoading?: boolean;
	isSubmitting?: boolean;
	closeAlert: () => void;
};

export function CompanyDelete({
	company,
	errors,
	isLoading,
	isSubmitting,
	closeAlert,
}: CompanyDeleteProps) {
	if (!company) {
		return (
			<AlertDialogRoot open>
				<AlertDialogBackdrop />
				<AlertDialogPopup>
					<AlertDialogTitle>
						{errors?.message || `Error Deleting Company!`}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{errors?.description ||
							`An error happened while deleting your company, please try again later.`}
					</AlertDialogDescription>
					<div className="flex justify-end gap-[25px]">
						<AlertDialogCancelButton onClick={closeAlert}>
							Cancel
						</AlertDialogCancelButton>
					</div>
				</AlertDialogPopup>
			</AlertDialogRoot>
		);
	}

	return (
		<AlertDialogRoot open>
			<AlertDialogBackdrop />
			<AlertDialogPopup onEscapeKeyDown={closeAlert}>
				<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
				<AlertDialogDescription>
					This action cannot be undone. This will permanently delete the{' '}
					<span className="font-bold">{company.name}</span> company.
				</AlertDialogDescription>
				<div className="flex justify-end gap-[25px]">
					<AlertDialogCancelButton disabled={isSubmitting} onClick={closeAlert}>
						Cancel
					</AlertDialogCancelButton>
					<Form method="POST">
						<AlertDialogActionButton>
							{isLoading ? '...Deleting' : 'Delete'}
						</AlertDialogActionButton>
					</Form>
				</div>
			</AlertDialogPopup>
		</AlertDialogRoot>
	);
}
