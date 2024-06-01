import * as React from 'react';

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

export type CustomField = {
	id: string;
	order: number;
	label: string;
	content: string;
	showLabelInInvoice?: boolean;
};
