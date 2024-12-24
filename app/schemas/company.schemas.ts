import * as v from 'valibot';
import { ulid } from 'ulid';
import { AddressFormSchema } from '~/schemas/address.schemas';

export const CompanyFormSchema = v.object({
	'company-id': v.optional(v.pipe(v.string(), v.ulid())),
	'company-name': v.pipe(v.string(), v.nonEmpty('Name is required')),
	'company-email': v.pipe(
		v.string(),
		v.nonEmpty('Email is required'),
		v.email('A valid email is required'),
	),
	'company-additional-information': v.optional(v.string()),
	...AddressFormSchema.entries,
});

export type CompanyFormFlatErrors = v.FlatErrors<typeof CompanyFormSchema>;

export function transformCompanyFormData(
	data: v.InferOutput<typeof CompanyFormSchema>,
) {
	const companyId = data['company-id'] || ulid();
	const addressId = data['address-address-id'] || ulid();

	return {
		address: {
			addressId,
			address1: data['address-address1'],
			address2: data['address-address2'],
			city: data['address-city'],
			country: data['address-country'],
			province: data['address-province'],
			zip: data['address-zip'],
		},
		company: {
			companyId,
			name: data['company-name'],
			email: data['company-email'],
			additionalInformation: data['company-additional-information'],
			addressId,
		},
	};
}
