import { z } from 'zod';

export const compamySchema = z.object({
	id: z.string(),
	name: z.string().min(1, 'Name is required'),
	email: z.string().email(),
	address: z.object({
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
				label: z.string().min(1, 'Label is required'),
				content: z.string().min(1, 'Content is required'),
				showLabel: z.boolean().optional(),
			}),
		)
		.optional(),
});
export type CompanySchemaErrors = z.inferFormattedError<typeof compamySchema>;

export const customerSchema = z.object({
	id: z.string(),
	name: z.string().min(1, 'Name is required'),
	email: z.string().email(),
	address: z.object({
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
				label: z.string().min(1, 'Label is required'),
				content: z.string().min(1, 'Content is required'),
				showLabel: z.boolean().optional(),
			}),
		)
		.optional(),
});
export type CustomerSchemaErrors = z.inferFormattedError<typeof customerSchema>;

export const serviceSchema = z.object({
	id: z.string(),
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional(),
	price: z.number().min(0, 'Price must be greater than or equal to 0'),
});
export type ServiceSchemaErrors = z.inferFormattedError<typeof serviceSchema>;
