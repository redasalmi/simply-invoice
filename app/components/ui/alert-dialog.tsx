import { AlertDialog } from '@base-ui-components/react/alert-dialog';
import { cn } from '~/utils/shared.utils';
import { Button } from '~/components/ui/button';

export function AlertDialogRoot(props: AlertDialog.Root.Props) {
	return <AlertDialog.Root {...props} />;
}

export function AlertDialogTrigger(props: AlertDialog.Trigger.Props) {
	return <AlertDialog.Trigger {...props} />;
}

export function AlertDialogPortal(props: AlertDialog.Portal.Props) {
	return <AlertDialog.Portal {...props} />;
}

export function AlertDialogBackdrop({
	className,
	...props
}: AlertDialog.Backdrop.Props) {
	return (
		<AlertDialog.Backdrop
			className={cn('bg-blackA6 fixed inset-0', className)}
			{...props}
		/>
	);
}

export function AlertDialogPopup({
	className,
	...props
}: AlertDialog.Popup.Props) {
	return (
		<AlertDialog.Popup
			className={cn(
				'fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none',
				className,
			)}
			{...props}
		/>
	);
}

export function AlertDialogTitle({
	className,
	...props
}: AlertDialog.Title.Props) {
	return (
		<AlertDialog.Title
			className={cn('text-mauve-12 m-0 text-[17px] font-medium', className)}
			{...props}
		/>
	);
}

export function AlertDialogDescription({
	className,
	...props
}: AlertDialog.Description.Props) {
	return (
		<AlertDialog.Description
			className={cn(
				'text-mauve-11 mt-4 mb-5 text-[15px] leading-normal',
				className,
			)}
			{...props}
		/>
	);
}

export function AlertDialogClose(props: AlertDialog.Close.Props) {
	return <AlertDialog.Close {...props} />;
}

export function AlertDialogCancelButton(props: AlertDialog.Close.Props) {
	return (
		<AlertDialog.Close render={<Button variant="alternative" />} {...props} />
	);
}

export function AlertDialogActionButton(props: AlertDialog.Close.Props) {
	return <AlertDialog.Close render={<Button variant="danger" />} {...props} />;
}
