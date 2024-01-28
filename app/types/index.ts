export type Field = {
	key: string;
	name: string;
	label: string;
	value: string;
	showLabel: boolean;
};

export type InvoiceField = {
	label: string;
	value: string;
	showLabel?: boolean;
};

export type Invoice = {
	id: string;
	createdAt: string;
	customer: Array<InvoiceField>;
};
