import * as v from 'valibot';
import { ulid } from 'ulid';
import { AddressFormSchema } from '~/lib/address/address.schemas';
import { requiredEmail, requiredName, requiredValidEmail } from '~/lib/errors';

export const CustomerFormSchema = v.pipe(
	v.object({
		'customer-id': v.optional(v.pipe(v.string(), v.ulid())),
		'customer-name': v.pipe(v.string(requiredName), v.nonEmpty(requiredName)),
		'customer-email': v.pipe(
			v.string(requiredEmail),
			v.nonEmpty(requiredEmail),
			v.email(requiredValidEmail),
		),
		'customer-additional-information': v.optional(v.string()),
		...AddressFormSchema.entries,
	}),
	v.transform((input) => {
		const customerId = input['customer-id'] || ulid();
		const addressId = input['address-address-id'] || ulid();

		return {
			address: {
				addressId,
				address1: input['address-address1'],
				address2: input['address-address2'],
				city: input['address-city'],
				country: input['address-country'],
				province: input['address-province'],
				zip: input['address-zip'],
			},
			customer: {
				customerId,
				name: input['customer-name'],
				email: input['customer-email'],
				additionalInformation: input['customer-additional-information'],
				addressId,
			},
		};
	}),
);

export type CustomerFormFlatErrors = v.FlatErrors<typeof CustomerFormSchema>;
