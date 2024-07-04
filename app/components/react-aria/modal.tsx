import {
	Dialog,
	ModalOverlay,
	type ModalOverlayProps,
	Modal as RACModal,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';
import { XIcon } from 'lucide-react';
import { Button } from './button';

const overlayStyles = tv({
	base: 'fixed top-0 left-0 w-full h-[--visual-viewport-height] isolate z-20 bg-black/[15%] flex items-center justify-center p-4 text-center backdrop-blur-lg',
	variants: {
		isEntering: {
			true: 'animate-in fade-in duration-200 ease-out',
		},
		isExiting: {
			true: 'animate-out fade-out duration-200 ease-in',
		},
	},
});

const modalStyles = tv({
	base: 'w-full max-w-md max-h-full rounded-2xl bg-white dark:bg-zinc-800/70 dark:backdrop-blur-2xl dark:backdrop-saturate-200 forced-colors:bg-[Canvas] text-left align-middle text-slate-700 dark:text-zinc-300 shadow-2xl bg-clip-padding border border-black/10 dark:border-white/10',
	variants: {
		isEntering: {
			true: 'animate-in zoom-in-105 ease-out duration-200',
		},
		isExiting: {
			true: 'animate-out zoom-out-95 ease-in duration-200',
		},
	},
});

export type ModalProps = ModalOverlayProps & {
	closeDialog?: () => void;
};

export function Modal({ closeDialog, children, ...props }: ModalProps) {
	return (
		<ModalOverlay {...props} className={overlayStyles}>
			<RACModal {...props} className={modalStyles}>
				<Dialog>
					{({ close }) => (
						<>
							<Button
								type="button"
								variant="icon"
								className="ml-auto block"
								onPress={closeDialog || close}
							>
								<XIcon />
							</Button>
							{children}
						</>
					)}
				</Dialog>
			</RACModal>
		</ModalOverlay>
	);
}
