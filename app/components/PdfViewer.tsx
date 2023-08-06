import { Modal } from '~/components';

type PdfViewerProps = {
	pdfBase64: string;
};

export function PdfViewer({ pdfBase64 }: PdfViewerProps) {
	if (!pdfBase64) {
		return null;
	}

	return (
		<iframe
			className="h-full w-full"
			src={`${pdfBase64}#toolbar=0&navpanes=0`}
		/>
	);
}

type ModalPdfViewerProps = {
	triggerText: string;
	triggerOnClick?: () => void;
	title?: string;
	description?: string;
	hasCloseBtn?: boolean;
	pdfBase64: string;
	isLoading: boolean;
};

export function ModalPdfViewer({
	triggerText,
	triggerOnClick,
	title,
	description,
	hasCloseBtn,
	pdfBase64,
	isLoading,
}: ModalPdfViewerProps) {
	return (
		<Modal
			triggerText={triggerText}
			triggerOnClick={triggerOnClick}
			title={title}
			description={description}
			hasCloseBtn={hasCloseBtn}
		>
			{isLoading ? 'Loading...' : <PdfViewer pdfBase64={pdfBase64} />}
		</Modal>
	);
}
