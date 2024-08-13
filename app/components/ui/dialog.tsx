import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import { cn } from '~/utils/shared.utils';
import { Button } from '~/components/ui/button';

export function DialogRoot(props: Dialog.DialogProps) {
	return <Dialog.Root {...props} />;
}

export const DialogTrigger = React.forwardRef<
	HTMLButtonElement,
	Dialog.DialogTriggerProps
>(function DialogTrigger(props, ref) {
	return <Dialog.Trigger ref={ref} {...props} />;
});

export function DialogPortal(props: Dialog.DialogPortalProps) {
	return <Dialog.Portal {...props} />;
}

export const DialogOverlay = React.forwardRef<
	HTMLDivElement,
	Dialog.DialogOverlayProps
>(function DialogOverlay({ className, ...props }, ref) {
	return (
		<Dialog.Overlay
			ref={ref}
			className={cn(
				'fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow',
				className,
			)}
			{...props}
		/>
	);
});

export const DialogContent = React.forwardRef<
	HTMLDivElement,
	Dialog.DialogContentProps
>(function DialogContent({ className, ...props }, ref) {
	return (
		<Dialog.Content
			ref={ref}
			className={cn(
				'fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow',
				className,
			)}
			{...props}
		/>
	);
});

export const DialogTitle = React.forwardRef<
	HTMLHeadingElement,
	Dialog.DialogTitleProps
>(function DialogTitle({ className, ...props }, ref) {
	return (
		<Dialog.Title
			ref={ref}
			className={cn('m-0 text-[17px] font-medium text-mauve12', className)}
			{...props}
		/>
	);
});

export const DialogDescription = React.forwardRef<
	HTMLParagraphElement,
	Dialog.DialogDescriptionProps
>(function DialogDescription({ className, ...props }, ref) {
	return (
		<Dialog.Description
			ref={ref}
			className={cn(
				'mb-5 mt-[10px] text-[15px] leading-normal text-mauve11',
				className,
			)}
			{...props}
		/>
	);
});

export const DialogClose = React.forwardRef<
	HTMLButtonElement,
	Dialog.DialogCloseProps
>(function DialogClose(props, ref) {
	return <Dialog.Close ref={ref} {...props} />;
});

export const DialogCloseButton = React.forwardRef<
	HTMLButtonElement,
	Omit<React.ComponentPropsWithoutRef<'button'>, 'className'>
>(function DialogCloseButton(props, ref) {
	return (
		<Button
			ref={ref}
			aria-label="Close"
			variant="icon"
			className="absolute right-[10px] top-[10px]"
			{...props}
		>
			<XIcon />
		</Button>
	);
});
