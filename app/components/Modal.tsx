import * as React from 'react';
import { DialogTrigger } from '@radix-ui/react-dialog';

import { Dialog, DialogContent } from '~/components/ui';
import { cn } from '~/lib/utils';

import { type ClassValue } from 'clsx';

type ModalPdfViewerProps = {
	triggerText: string;
	triggerClassname?: ClassValue;
	contentClassname?: ClassValue;
	children: React.ReactNode;
};

export function Modal({
	triggerText,
	triggerClassname,
	contentClassname,
	children,
}: ModalPdfViewerProps) {
	return (
		<Dialog>
			<DialogTrigger className={cn(triggerClassname)}>
				{triggerText}
			</DialogTrigger>
			<DialogContent className={cn(contentClassname)}>{children}</DialogContent>
		</Dialog>
	);
}
