import { DialogTrigger } from '@radix-ui/react-dialog';

import { Dialog, DialogContent } from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';

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
			<DialogTrigger>
				<Button type="button" onClick={triggerOnClick}>
					{triggerText}
				</Button>
			</DialogTrigger>
			<DialogContent className="h-full max-h-[80%] max-w-[80%]">
				{isLoading ? 'Loading...' : <PdfViewer pdfBase64={pdfBase64} />}
			</DialogContent>
		</Dialog>
	);
}
