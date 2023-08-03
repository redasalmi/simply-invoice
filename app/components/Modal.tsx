import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';

type ModalProps = {
	triggerText: string;
	triggerOnClick?: () => void;
	title?: string;
	description?: string;
	hasCloseBtn?: boolean;
	children: React.ReactNode;
};

export function Modal({
	triggerText,
	triggerOnClick,
	title,
	description,
	children,
	hasCloseBtn = true,
}: ModalProps) {
	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>
				<button
					type="button"
					className="rounded-md bg-blue-400 px-4 py-2"
					onClick={triggerOnClick}
				>
					{triggerText}
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-20 bg-black/50" />
				<Dialog.Content
					className={clsx(
						'fixed inset-0 z-50 m-auto',
						'max-h-[80vh] max-w-[80vw] rounded-lg md:w-full',
						'bg-white dark:bg-gray-800',
						'focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75',
					)}
				>
					{title ? <Dialog.Title>{title}</Dialog.Title> : null}

					{description ? (
						<Dialog.Description>
							Make changes to your profile here. Click save when you're done.
						</Dialog.Description>
					) : null}

					{children}

					{hasCloseBtn ? (
						<div className="mt-4 flex justify-end">
							<Dialog.Close asChild>
								<button
									type="button"
									className="rounded-md bg-red-400 px-4 py-2"
								>
									Close
								</button>
							</Dialog.Close>
						</div>
					) : null}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
