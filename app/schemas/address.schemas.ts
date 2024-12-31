import * as v from 'valibot';
import { ulid } from 'ulid';

export const AddressFormSchema = v.pipe(
	v.object({
		'address-address-id': v.optional(v.pipe(v.string(), v.ulid())),
		'address-address1': v.pipe(v.string(), v.nonEmpty('Address 1 is required')),
		'address-address2': v.optional(v.string()),
		'address-city': v.optional(v.string()),
		'address-country': v.pipe(v.string(), v.nonEmpty('Country is required')),
		'address-province': v.optional(v.string()),
		'address-zip': v.optional(v.string()),
	}),
	v.transform((input) => {
		const addressId = input['address-address-id'] || ulid();

		return {
			addressId,
			address1: input['address-address1'],
			address2: input['address-address2'],
			city: input['address-city'],
			country: input['address-country'],
			province: input['address-province'],
			zip: input['address-zip'],
		};
	}),
);
