import * as React from 'react';
import type { InputProps } from '~/components/ui/input';
import type { LabelProps } from '~/components/ui/label';

export type FormFieldProps = {
	type?: React.HTMLInputTypeAttribute;
	id: string;
	name: string;
	label: string;
	defaultValue?: string;
	className?: string;
	required?: boolean;
	error?: string;
};

export type FieldProps = {
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
