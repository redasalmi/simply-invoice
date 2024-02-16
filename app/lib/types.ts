export type Field = {
	id: string;
	name: string;
	label: string;
	input?: React.InputHTMLAttributes<HTMLInputElement>;
	error?: string;
};

export type CustomField = {
	id: string;
	label: string;
	content: string;
	showLabel?: boolean;
	labelError?: string;
	contentError?: string;
};

export type Address = {
	address1: string;
	address2?: string;
	city?: string;
	country: string;
	province?: string;
	zip?: string;
};

export type Company = {
	id: string;
	name: string;
	email: string;
	address: Address;
	custom?: Array<CustomField>;
};

export type Customer = {
	id: string;
	name: string;
	email: string;
	address: Address;
	custom?: Array<CustomField>;
};

export type Service = {
	id: string;
	name: string;
	description?: string;
	price: number;
};

export type Invoice = {
	id: string;
	createdAt: string;
	customer: Customer;
};
