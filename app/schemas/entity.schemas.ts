import * as v from 'valibot';
import { ulid } from 'ulid';
import { parseCustomFields } from '~/utils/parseCustomFields.utils';
import {
	customContentKey,
	customLabelKey,
	safeParseCustomField,
} from '~/schemas/customField.schema';

export const EntityFormSchema = v.pipe(
	v.objectWithRest(
		{
			'entity-id': v.optional(v.pipe(v.string(), v.ulid())),
			name: v.pipe(v.string(), v.nonEmpty()),
			email: v.pipe(v.string(), v.nonEmpty(), v.email()),
			'address-address-id': v.optional(v.pipe(v.string(), v.ulid())),
			'address-address1': v.pipe(v.string(), v.nonEmpty()),
			'address-address2': v.optional(v.string()),
			'address-city': v.optional(v.string()),
			'address-country': v.pipe(v.string(), v.nonEmpty()),
			'address-province': v.optional(v.string()),
			'address-zip': v.optional(v.string()),
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

type Entity<T extends string> = {
	[key in T]: string;
} & {
	name: string;
	email: string;
	addressId: string;
};

type EntityCustomField<T extends string, K extends string> = {
	[key in T]: string;
} & {
	[key in K]: string;
} & {
	customFieldIndex: number;
	label: string;
	content: string;
	showLabelInInvoice?: boolean;
};

export function transformEntityCreateFormData<
	T extends string,
	K extends string,
>(
	data: v.InferOutput<typeof EntityFormSchema>,
	entityIdKey: T,
	customFieldIdKey: K,
	entityId: string = ulid(),
) {
	const addressId = data['address-addressId'] || ulid();

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
		entity: {
			[entityIdKey]: entityId,
			name: data.name,
			email: data.email,
			addressId,
		} as Entity<T>,
		customFields: parseCustomFields(data, customFieldIdKey, {
			id: entityId,
			key: entityIdKey,
		}) as Array<EntityCustomField<T, K>>,
	};
}
