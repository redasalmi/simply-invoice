import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import { cn } from '~/utils/shared.utils';

export function DialogRoot(props: Dialog.DialogProps) {
	return <Dialog.Root {...props} />;
}

export function DialogTrigger(props: Dialog.DialogTriggerProps) {
	return <Dialog.Trigger {...props} />;
}

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
				'fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[state=open]:animate-contentShow focus:outline-none',
				className,
			)}
			{...props}
		/>
	);
});

export function DialogTitle({ className, ...props }: Dialog.DialogTitleProps) {
	return (
		<Dialog.Title
			className={cn('m-0 text-[17px] font-medium text-mauve12', className)}
			{...props}
		/>
	);
}

export function DialogDescription({
	className,
	...props
}: Dialog.DialogDescriptionProps) {
	return (
		<Dialog.Description
			className={cn(
				'mb-5 mt-[10px] text-[15px] leading-normal text-mauve11',
				className,
			)}
			{...props}
		/>
	);
}

export function DialogClose(props: Dialog.DialogCloseProps) {
	return <Dialog.Close {...props} />;
}

export const DialogCloseButton = React.forwardRef<
	HTMLButtonElement,
	Omit<React.ComponentPropsWithoutRef<'button'>, 'className'>
>(function DialogCloseButton(props, ref) {
	return (
		<button
			ref={ref}
			className="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full text-violet11 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
			aria-label="Close"
			{...props}
		>
			<XIcon />
		</button>
	);
});
