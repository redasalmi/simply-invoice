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

export type Customer = {
	name: string;
	email: string;
	custom: Array<InvoiceField>;
};

export type Invoice = {
	id: string;
	createdAt: string;
	customer: Customer;
};
