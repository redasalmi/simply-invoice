import createAddressSql from '~/sql/create-address.sql?raw';

export type Address = {
	address_id: string;
	address1: string;
	address2?: string;
	city?: string;
	country: string;
	province?: string;
	zip?: string;
	created_at: string;
	updated_at?: string;
};

export async function createAddress(
	address: Omit<Address, 'created_at' | 'updated_at'>,
) {
	return window.db.execute(createAddressSql, [
		address.address_id,
		address.address1,
		address.address2,
		address.city,
		address.country,
		address.province,
		address.zip,
	]);
}
