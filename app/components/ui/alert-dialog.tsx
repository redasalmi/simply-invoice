import * as React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { cn } from '~/utils/shared.utils';
import { Button } from '~/components/ui/button';

type ButtonRef = HTMLButtonElement;
type ButtonProps = Omit<React.ComponentPropsWithoutRef<'button'>, 'className'>;

export function AlertDialogRoot(props: AlertDialog.AlertDialogProps) {
	return <AlertDialog.Root {...props} />;
}

export const AlertDialogTrigger = React.forwardRef<
	HTMLButtonElement,
	AlertDialog.AlertDialogTriggerProps
>(function AlertDialogTrigger(props, ref) {
	return <AlertDialog.Trigger ref={ref} {...props} />;
});

export function AlertDialogPortal(props: AlertDialog.AlertDialogPortalProps) {
	return <AlertDialog.Portal {...props} />;
}

export const AlertDialogOverlay = React.forwardRef<
	HTMLDivElement,
	AlertDialog.AlertDialogOverlayProps
>(function AlertDialogOverlay({ className, ...props }, ref) {
	return (
		<AlertDialog.Overlay
			ref={ref}
			className={cn(
				'fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow',
				className,
			)}
			{...props}
		/>
	);
});

export const AlertDialogContent = React.forwardRef<
	HTMLDivElement,
	AlertDialog.AlertDialogContentProps
>(function AlertDialogContent({ className, ...props }, ref) {
	return (
		<AlertDialog.Content
			ref={ref}
			className={cn(
				'fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow',
				className,
			)}
			{...props}
		/>
	);
});

export const AlertDialogTitle = React.forwardRef<
	HTMLHeadingElement,
	AlertDialog.AlertDialogTitleProps
>(function AlertDialogTitle({ className, ...props }, ref) {
	return (
		<AlertDialog.Title
			ref={ref}
			className={cn('m-0 text-[17px] font-medium text-mauve12', className)}
			{...props}
		/>
	);
});

export const AlertDialogDescription = React.forwardRef<
	HTMLParagraphElement,
	AlertDialog.AlertDialogDescriptionProps
>(function AlertDialogDescription({ className, ...props }, ref) {
	return (
		<AlertDialog.Description
			ref={ref}
			className={cn(
				'mb-5 mt-4 text-[15px] leading-normal text-mauve11',
				className,
			)}
			{...props}
		/>
	);
});

export const AlertDialogCancel = React.forwardRef<
	HTMLButtonElement,
	AlertDialog.AlertDialogCancelProps
>(function AlertDialogCancel(props, ref) {
	return <AlertDialog.Cancel ref={ref} {...props} />;
});

export const AlertDialogAction = React.forwardRef<
	HTMLButtonElement,
	AlertDialog.AlertDialogActionProps
>(function AlertDialogAction(props, ref) {
	return <AlertDialog.Action ref={ref} {...props} />;
});

export const AlertDialogTriggerButton = React.forwardRef<
	ButtonRef,
	ButtonProps
>(function AlertDialogTriggerButton(props, ref) {
	return <Button ref={ref} {...props} />;
});

export const AlertDialogCancelButton = React.forwardRef<ButtonRef, ButtonProps>(
	function AlertDialogCancelButton(props, ref) {
		return <Button ref={ref} variant="alternative" {...props} />;
	},
);

export const AlertDialogActionButton = React.forwardRef<ButtonRef, ButtonProps>(
	function AlertDialogActionButton(props, ref) {
		return <Button ref={ref} variant="danger" {...props} />;
	},
);
