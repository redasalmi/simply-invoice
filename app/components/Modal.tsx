import * as React from 'react';
import { DialogTrigger } from '@radix-ui/react-dialog';

import { Dialog, DialogContent } from '~/components/ui';
import { cn } from '~/lib/utils';

import { type ClassValue } from 'clsx';

type ModalPdfViewerProps = {
	triggerText: string;
	triggerClassName?: ClassValue;
	contentClassName?: ClassValue;
	children: React.ReactNode;
};

export function Modal({
	triggerText,
	triggerClassName,
	contentClassName,
	children,
}: ModalPdfViewerProps) {
	return (
		<Dialog>
			<DialogTrigger className={cn(triggerClassName)}>
				{triggerText}
			</DialogTrigger>
			<DialogContent className={cn(contentClassName)}>{children}</DialogContent>
		</Dialog>
	);
}
