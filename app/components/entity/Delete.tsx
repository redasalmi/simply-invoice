import { Form } from '@remix-run/react';
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
import { capitalize } from '~/utils/shared.utils';
import type { EntityType } from '~/types/entity.types';

type DeleteEntityProps = {
	type: EntityType;
	entityName: string;
	isSubmitting?: boolean;
	isLoading?: boolean;
	closeAlert: () => void;
};

export function DeleteEntity({
	type,
	entityName,
	isSubmitting,
	isLoading,
	closeAlert,
}: DeleteEntityProps) {
	return (
		<AlertDialogRoot open>
			<AlertDialogOverlay>
				<AlertDialogContent onEscapeKeyDown={closeAlert}>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the{' '}
						<span className="font-bold">{entityName}</span> {type}.
					</AlertDialogDescription>
					<div className="flex justify-end gap-[25px]">
						<AlertDialogCancel
							disabled={isSubmitting}
							onClick={closeAlert}
							asChild
						>
							<AlertDialogCancelButton>Cancel</AlertDialogCancelButton>
						</AlertDialogCancel>
						<AlertDialogAction type="submit" disabled={isSubmitting} asChild>
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

type DeleteEntityErrorProps = {
	type: EntityType;
	error?: {
		message?: string;
		description?: string;
	};
	closeAlert: () => void;
};

export function DeleteEntityError({
	type,
	error,
	closeAlert,
}: DeleteEntityErrorProps) {
	return (
		<AlertDialogRoot open>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogTitle>
						{error?.message || `Error Deleting ${capitalize(type)}!`}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{error?.description ||
							`An error happened while deleting your ${type}, please try again later.`}
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
