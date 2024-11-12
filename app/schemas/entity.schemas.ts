import * as v from 'valibot';
import { z } from 'zod';
import {
	customContentKey,
	customLabelKey,
	safeParseCustomField,
} from './customField.schema';
import { ulid } from 'ulid';
import { parseCustomFields } from '~/utils/parseCustomFields.utils';

export const EntityFormSchema = v.pipe(
	v.objectWithRest(
		{
			name: v.pipe(v.string(), v.nonEmpty()),
			email: v.pipe(v.string(), v.nonEmpty(), v.email()),
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

export function transformEntityFormSchemaData<
	T extends string,
	K extends string,
>(
	data: v.InferOutput<typeof EntityFormSchema>,
	entityIdKey: T,
	customFieldIdKey: K,
) {
	const addressId = ulid();
	const entityId = ulid();

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

export const createEntitySchema = z.object({
	id: z.string(),
	name: z.string().min(1, 'Name is required'),
	email: z.string().email(),
	address: z.object({
		id: z.string(),
		address1: z.string().min(1, 'Address 1 is required'),
		address2: z.string().optional(),
		city: z.string().optional(),
		country: z.string().min(1, 'Country is required'),
		province: z.string().optional(),
		zip: z.string().optional(),
	}),
	custom: z
		.array(
			z.object({
				id: z.string(),
				order: z.number(),
				label: z.string().min(1, 'Label is required'),
				content: z.string().min(1, 'Content is required'),
				showLabelInInvoice: z.boolean().optional(),
			}),
		)
		.optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type CreateEntitySchemaErrors = z.inferFormattedError<
	typeof createEntitySchema
>;

export const updateEntitySchema = z.object({
	id: z.string(),
	name: z.string().min(1, 'Name is required'),
	email: z.string().email(),
	'address.address1': z.string().min(1, 'Address 1 is required'),
	'address.address2': z.string().optional(),
	'address.city': z.string().optional(),
	'address.country': z.string().min(1, 'Country is required'),
	'address.province': z.string().optional(),
	'address.zip': z.string().optional(),
	custom: z
		.array(
			z.object({
				id: z.string(),
				order: z.number(),
				label: z.string().min(1, 'Label is required'),
				content: z.string().min(1, 'Content is required'),
				showLabelInInvoice: z.boolean().optional(),
			}),
		)
		.optional(),
	updatedAt: z.string(),
});

export type UpdateEntitySchemaErrors = z.inferFormattedError<
	typeof updateEntitySchema
>;
