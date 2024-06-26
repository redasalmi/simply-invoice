import * as React from 'react';
import { cn } from '~/utils/shared.utils';
import { Button, type ButtonProps, type ButtonRef } from './button';

type DivRef = HTMLDivElement;
type DivProps = React.ComponentPropsWithoutRef<'div'>;

type AlertDialogProps = React.ComponentPropsWithoutRef<'div'> & {
	open: boolean;
};

type TitleRef = HTMLHeadingElement;
type TitleProps = React.ComponentPropsWithoutRef<'h2'>;

type DescriptionRef = HTMLParagraphElement;
type DescriptionProps = React.ComponentPropsWithoutRef<'p'>;

export const AlertDialog = React.forwardRef<DivRef, AlertDialogProps>(
	function AlertDialog({ open, className, children, ...props }, ref) {
		if (!open) {
			return null;
		}

		return (
			<div>
				<div className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
				<div
					ref={ref}
					role="alert"
					className={cn(
						'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
						className,
					)}
					{...props}
				>
					{children}
				</div>
			</div>
		);
	},
);

export const AlertDialogContent = React.forwardRef<DivRef, DivProps>(
	function AlertDialogContent({ children, ...props }, ref) {
		return (
			<div ref={ref} {...props}>
				{children}
			</div>
		);
	},
);

export const AlertDialogHeader = React.forwardRef<DivRef, DivProps>(
	function AlertDialogHeader({ className, children, ...props }, ref) {
		return (
			<div
				ref={ref}
				className={cn(
					'flex flex-col space-y-2 text-center sm:text-left',
					className,
				)}
				{...props}
			>
				{children}
			</div>
		);
	},
);

export const AlertDialogTitle = React.forwardRef<TitleRef, TitleProps>(
	function AlertDialogTitle({ className, children, ...props }, ref) {
		return (
			<h2
				ref={ref}
				className={cn('text-lg font-semibold', className)}
				{...props}
			>
				{children}
			</h2>
		);
	},
);

export const AlertDialogDescription = React.forwardRef<
	DescriptionRef,
	DescriptionProps
>(function AlertDialogDescription({ className, children, ...props }, ref) {
	return (
		<p
			ref={ref}
			className={cn('text-sm text-muted-foreground', className)}
			{...props}
		>
			{children}
		</p>
	);
});

export const AlertDialogFooter = React.forwardRef<DivRef, DivProps>(
	function AlertDialogFooter({ className, children, ...props }, ref) {
		return (
			<div
				ref={ref}
				className={cn(
					'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
					className,
				)}
				{...props}
			>
				{children}
			</div>
		);
	},
);

export const AlertDialogAction = React.forwardRef<ButtonRef, ButtonProps>(
	function AlertDialogAction({ children, ...props }, ref) {
		return (
			<Button ref={ref} {...props}>
				{children}
			</Button>
		);
	},
);

export const AlertDialogCancel = React.forwardRef<ButtonRef, ButtonProps>(
	function AlertDialogCancel({ children, ...props }, ref) {
		return (
			<Button ref={ref} {...props}>
				{children}
			</Button>
		);
	},
);
