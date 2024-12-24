import * as v from 'valibot';

export const AddressFormSchema = v.object({
	'address-address-id': v.optional(v.pipe(v.string(), v.ulid())),
	'address-address1': v.pipe(v.string(), v.nonEmpty('Address 1 is required')),
	'address-address2': v.optional(v.string()),
	'address-city': v.optional(v.string()),
	'address-country': v.pipe(v.string(), v.nonEmpty('Country is required')),
	'address-province': v.optional(v.string()),
	'address-zip': v.optional(v.string()),
});
