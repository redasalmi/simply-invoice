export type Field = {
	key: string;
	name: string;
	label: string;
	value: string;
	showLabel: boolean;
};

export type Address = {
	address1: string;
	address2: string;
	city: string;
	country: string;
	province: string;
	zip: string;
};

export type CustomField = {
	label: string;
	value: string;
	showLabel?: boolean;
};

export type Company = {
	id: string;
	name: string;
	email: string;
	address: Address;
	custom: Array<CustomField>;
};

export type Customer = {
	id: string;
	name: string;
	email: string;
	address: Address;
	custom: Array<CustomField>;
};

export type Invoice = {
	id: string;
	createdAt: string;
	customer: Customer;
};
