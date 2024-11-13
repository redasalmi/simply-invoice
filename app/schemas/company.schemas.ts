import * as v from 'valibot';
import { ulid } from 'ulid';
import { parseCustomFields } from '~/utils/parseCustomFields.utils';
import {
	customContentKey,
	customLabelKey,
	safeParseCustomField,
} from '~/schemas/customField.schema';
import { AddressFormSchema } from '~/schemas/address.schemas';

export const CompanyFormSchema = v.pipe(
	v.objectWithRest(
		{
			'company-id': v.optional(v.pipe(v.string(), v.ulid())),
			'company-name': v.pipe(v.string(), v.nonEmpty()),
			'company-email': v.pipe(v.string(), v.nonEmpty(), v.email()),
			...AddressFormSchema.entries,
		},
		v.string(),
	),
	v.rawCheck(({ dataset, addIssue }) => {
		for (const key in dataset.value) {
			if (key.includes(customLabelKey) || key.includes(customContentKey)) {
				const parsedValue = safeParseCustomField(key, dataset.value[key]);

				if (parsedValue?.issues) {
					parsedValue.issues.forEach((issue) => {
						addIssue(issue);
					});
				}
			}
		}
	}),
);

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
			addressId,
		},
		customFields: parseCustomFields(data, 'companyCustomFieldId', {
			id: companyId,
			key: 'companyId',
		}),
	};
}
