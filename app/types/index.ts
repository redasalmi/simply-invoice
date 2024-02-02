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

export type Address = {
	address1: string;
	address2: string;
	city: string;
	country: string;
	province: string;
	zip: string;
};

export type Company = {
	id: string;
	name: string;
	email: string;
	address: Address;
	custom: Array<InvoiceField>;
};
