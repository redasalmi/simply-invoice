import { Form } from '@remix-run/react';
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
import { capitalize } from '~/utils/shared';
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
		<AlertDialog open>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the{' '}
						<span className="font-bold">{entityName}</span> {type}.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isSubmitting} onClick={closeAlert}>
						Cancel
					</AlertDialogCancel>
					<Form method="POST">
						<AlertDialogAction disabled={isSubmitting} type="submit">
							{isLoading ? '...Deleting' : 'Delete'}
						</AlertDialogAction>
					</Form>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
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
		<AlertDialog open>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{error?.message || `Error Deleting ${capitalize(type)}!`}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{error?.description ||
							`An error happened while deleting your ${type}, please try again later.`}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={closeAlert}>Close</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
