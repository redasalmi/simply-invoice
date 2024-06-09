import type { InputProps } from '~/components/ui/input';
import type { LabelProps } from '~/components/ui/label';

export type FormFieldProps = {
	id: string;
	label: Omit<LabelProps, 'htmlFor' | 'error'>;
	input: Omit<InputProps, 'id' | 'hasError'>;
	error?: string;
	className?: string;
};

export type CustomField = {
	id: string;
	order: number;
	label: string;
	content: string;
	showLabelInInvoice?: boolean;
};
