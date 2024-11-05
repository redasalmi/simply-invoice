import { createAddressQuery } from '~/sql/addresses.sql';

export type Address = {
	addressId: string;
	address1: string;
	address2?: string;
	city?: string;
	country: string;
	province?: string;
	zip?: string;
	createdAt: string;
	updatedAt?: string;
};

export async function createAddress(
	address: Omit<Address, 'createdAt' | 'updatedAt'>,
) {
	return window.db.execute(createAddressQuery, [
		address.addressId,
		address.address1,
		address.address2,
		address.city,
		address.country,
		address.province,
		address.zip,
	]);
}
