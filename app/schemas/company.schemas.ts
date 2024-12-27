import * as v from 'valibot';
import { ulid } from 'ulid';
import { AddressFormSchema } from '~/schemas/address.schemas';

export const CompanyFormSchema = v.pipe(
	v.object({
		'company-id': v.optional(v.pipe(v.string(), v.ulid())),
		'company-name': v.pipe(v.string(), v.nonEmpty('Name is required')),
		'company-email': v.pipe(
			v.string(),
			v.nonEmpty('Email is required'),
			v.email('A valid email is required'),
		),
		'company-additional-information': v.optional(v.string()),
		...AddressFormSchema.entries,
	}),
	v.transform((input) => {
		const companyId = input['company-id'] || ulid();
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
			company: {
				companyId,
				name: input['company-name'],
				email: input['company-email'],
				additionalInformation: input['company-additional-information'],
				addressId,
			},
		};
	}),
);

export type CompanyFormFlatErrors = v.FlatErrors<typeof CompanyFormSchema>;
