import { createAddressSql, updateAddressSql } from '~/sql/addresses.sql';
import type { Address } from '~/types';

type CreateAddressInput = Omit<Address, 'createdAt' | 'updatedAt'>;

export async function createAddress(address: CreateAddressInput) {
	return window.db.execute(createAddressSql, [
		address.addressId,
		address.address1,
		address.address2,
		address.city,
		address.country,
		address.province,
		address.zip,
	]);
}

type UpdateAddressInput = Omit<Address, 'createdAt' | 'updatedAt'>;

export async function updateAddress(address: UpdateAddressInput) {
	return window.db.execute(updateAddressSql, [
		address.address1,
		address.address2,
		address.city,
		address.country,
		address.province,
		address.zip,
		address.addressId,
	]);
}
