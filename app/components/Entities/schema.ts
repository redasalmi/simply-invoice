import { z } from 'zod';

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
