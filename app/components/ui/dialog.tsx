import { Dialog } from '@base-ui-components/react';
import { XIcon } from 'lucide-react';
import { cn } from '~/utils/shared.utils';
import { Button } from '~/components/ui/button';

export function DialogRoot(props: Dialog.Root.Props) {
	return <Dialog.Root {...props} />;
}

export function DialogTrigger(props: Dialog.Trigger.Props) {
	return <Dialog.Trigger {...props} />;
}

export function DialogPortal(props: Dialog.Portal.Props) {
	return <Dialog.Portal {...props} />;
}

export function DialogOverlay({ className, ...props }: Dialog.Backdrop.Props) {
	return (
		<Dialog.Backdrop
			className={cn('bg-blackA6 fixed inset-0', className)}
			{...props}
		/>
	);
}

export function DialogPopup({ className, ...props }: Dialog.Popup.Props) {
	return (
		<Dialog.Popup
			className={cn(
				'fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none',
				className,
			)}
			{...props}
		/>
	);
}

export function DialogTitle({ className, ...props }: Dialog.Title.Props) {
	return (
		<Dialog.Title
			className={cn('text-mauve-12 m-0 text-[17px] font-medium', className)}
			{...props}
		/>
	);
}

export function DialogDescription({
	className,
	...props
}: Dialog.Description.Props) {
	return (
		<Dialog.Description
			className={cn(
				'text-mauve-11 mt-[10px] mb-5 text-[15px] leading-normal',
				className,
			)}
			{...props}
		/>
	);
}

export function DialogClose(props: Dialog.Close.Props) {
	return (
		<Dialog.Close
			render={
				<Button
					variant="icon"
					aria-label="close"
					className="absolute top-[10px] right-[10px]"
				>
					<XIcon />
				</Button>
			}
			{...props}
		/>
	);
}
