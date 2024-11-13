import { Form } from 'react-router';
import {
	AlertDialogAction,
	AlertDialogActionButton,
	AlertDialogCancel,
	AlertDialogCancelButton,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogOverlay,
	AlertDialogRoot,
	AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import { Company } from '~/types';

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
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogTitle>
							{errors?.message || `Error Deleting Company!`}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{errors?.description ||
								`An error happened while deleting your company, please try again later.`}
						</AlertDialogDescription>
						<div className="flex justify-end gap-[25px]">
							<AlertDialogCancel onClick={closeAlert} asChild>
								<AlertDialogCancelButton>Cancel</AlertDialogCancelButton>
							</AlertDialogCancel>
						</div>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialogRoot>
		);
	}

	return (
		<AlertDialogRoot open>
			<AlertDialogOverlay>
				<AlertDialogContent onEscapeKeyDown={closeAlert}>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the{' '}
						<span className="font-bold">{company.name}</span> company.
					</AlertDialogDescription>
					<div className="flex justify-end gap-[25px]">
						<AlertDialogCancel
							disabled={isSubmitting}
							onClick={closeAlert}
							asChild
						>
							<AlertDialogCancelButton>Cancel</AlertDialogCancelButton>
						</AlertDialogCancel>
						<AlertDialogAction asChild>
							<Form method="POST">
								<AlertDialogActionButton disabled={isSubmitting} type="submit">
									{isLoading ? '...Deleting' : 'Delete'}
								</AlertDialogActionButton>
							</Form>
						</AlertDialogAction>
					</div>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialogRoot>
	);
}
