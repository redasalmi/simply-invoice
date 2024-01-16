import { DialogTrigger } from '@radix-ui/react-dialog';

import { Dialog, DialogContent } from '~/components/ui/dialog';

type PdfViewerProps = {
	pdfBase64: string;
};

export function PdfViewer({ pdfBase64 }: PdfViewerProps) {
	if (!pdfBase64) {
		return null;
	}

	return (
		<iframe
			title="pdf viewer"
			className="h-full w-full"
			src={`${pdfBase64}#toolbar=0&navpanes=0`}
		/>
	);
}

type ModalPdfViewerProps = {
	triggerText: string;
	triggerOnClick: () => void;
	pdfBase64: string;
	isLoading: boolean;
};

export function ModalPdfViewer({
	triggerText,
	triggerOnClick,
	pdfBase64,
	isLoading,
}: ModalPdfViewerProps) {
	return (
		<Dialog>
			<DialogTrigger
				className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
				onClick={triggerOnClick}
			>
				{triggerText}
			</DialogTrigger>
			<DialogContent className="h-full max-h-[80%] max-w-[80%]">
				{isLoading ? 'Loading...' : <PdfViewer pdfBase64={pdfBase64} />}
			</DialogContent>
		</Dialog>
	);
}
