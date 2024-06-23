import * as React from 'react';
import { useClickAway } from '~/hooks/useClickAway';
import { useKeyPress } from '~/hooks/useKeyPress';
import { cn } from '~/utils/shared.utils';

type Ref = HTMLDivElement;

type DialogProps = React.ComponentPropsWithoutRef<'div'> & {
	open: boolean;
	closeDialog: () => void;
};

export const Dialog = React.forwardRef<Ref, DialogProps>(function Dialog(
	{ open, className, closeDialog, children, ...props },
	ref,
) {
	const fallbackRef = React.useRef<Ref>(null);
	const dialogRef = ref || fallbackRef;

	useClickAway(dialogRef, closeDialog);
	useKeyPress('Escape', closeDialog);

	if (!open) {
		return null;
	}

	return (
		<div>
			<div className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal
				className={cn(
					'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
					className,
				)}
				{...props}
			>
				<div>
					<button type="button" className="ml-auto block" onClick={closeDialog}>
						X
					</button>
				</div>
				{children}
			</div>
		</div>
	);
});

type DialogContentProps = React.ComponentPropsWithoutRef<'div'>;

export const DialogContent = React.forwardRef<Ref, DialogContentProps>(
	function DialogContent({ children, ...props }, ref) {
		return (
			<div ref={ref} {...props}>
				{children}
			</div>
		);
	},
);
