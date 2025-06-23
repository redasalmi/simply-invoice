import { XIcon } from "lucide-react";
import { createContext, useContext, useRef } from "react";
import { Button, type ButtonProps } from "~/renderer/components/ui/button";
import { cn } from "~/renderer/utils/cn";

const DialogContext = createContext<{
	dialogRef: React.RefObject<HTMLDialogElement | null>;
} | null>(null);

function useDialog() {
	const context = useContext(DialogContext);
	if (!context) {
		throw new Error("useDialog must be used within a Dialog");
	}

	return context;
}

function DialogTitle({
	className,
	...props
}: React.ComponentPropsWithRef<"h2">) {
	return (
		<h2
			className={cn("text-mauve-12 m-0 text-[17px] font-medium", className)}
			{...props}
		/>
	);
}

function DialogDescription({
	className,
	...props
}: React.ComponentPropsWithRef<"div">) {
	return (
		<div
			className={cn(
				"text-mauve-11 mt-[10px] mb-5 text-[15px] leading-normal",
				className,
			)}
			{...props}
		/>
	);
}

interface DialogCloseButtonProps {
	autoFocus?: boolean;
	onClick?: (ref: React.RefObject<HTMLDialogElement | null>) => void;
}

function DialogCloseButton({ autoFocus, onClick }: DialogCloseButtonProps) {
	const { dialogRef } = useDialog();

	const handleClick = () => {
		if (onClick) {
			onClick(dialogRef);

			return;
		}

		dialogRef.current?.close();
	};

	return (
		<Button
			variant="icon"
			className="absolute top-2 right-2 size-8"
			autoFocus={autoFocus}
			onClick={handleClick}
		>
			<XIcon className="h-4 w-4" />
		</Button>
	);
}

interface DialogCancelButtonProps
	extends Omit<ButtonProps, "onClick" | "variant"> {
	onClick?: (ref: React.RefObject<HTMLDialogElement | null>) => void;
}

function DialogCancelButton({ onClick, ...props }: DialogCancelButtonProps) {
	const { dialogRef } = useDialog();

	const handleClick = () => {
		if (onClick) {
			onClick(dialogRef);

			return;
		}

		dialogRef.current?.close();
	};

	return <Button variant="alternative" onClick={handleClick} {...props} />;
}

interface DialogActionButtonProps extends Omit<ButtonProps, "variant"> {}

function DialogActionButton(props: DialogActionButtonProps) {
	return <Button variant="danger" {...props} />;
}

interface DialogProps
	extends Omit<React.ComponentPropsWithRef<"dialog">, "ref"> {
	closeDialog?: (ref: React.RefObject<HTMLDialogElement | null>) => void;
}

export function Dialog({
	className,
	children,
	closeDialog,
	...props
}: DialogProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
		if (event.key !== "Escape") {
			return;
		}

		if (closeDialog) {
			closeDialog(dialogRef);

			return;
		}

		dialogRef.current?.close();
	};

	const handleClickOutside = (event: React.MouseEvent<HTMLDialogElement>) => {
		if (event.target !== event.currentTarget) {
			return;
		}

		if (closeDialog) {
			closeDialog(dialogRef);

			return;
		}

		dialogRef.current?.close();
	};

	return (
		<dialog
			ref={dialogRef}
			className={cn(
				"bg-transparent backdrop-brightness-50 fixed inset-0 z-50 size-full flex items-center justify-center",
				className,
			)}
			onKeyDown={handleKeyDown}
			onClick={handleClickOutside}
			{...props}
		>
			<DialogContext.Provider value={{ dialogRef }}>
				<div className="bg-white p-8 rounded-lg relative">{children}</div>
			</DialogContext.Provider>
		</dialog>
	);
}

Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.CloseButton = DialogCloseButton;
Dialog.CancelButton = DialogCancelButton;
Dialog.ActionButton = DialogActionButton;
