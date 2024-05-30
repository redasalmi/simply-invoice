import { z } from 'zod';

export const createCompanySchema = z.object({
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
export const updateCompanySchema = createCompanySchema.omit({
	createdAt: true,
});
export type CreateCompanySchemaErrors = z.inferFormattedError<
	typeof createCompanySchema
>;
export type UpdateCompanySchemaErrors = z.inferFormattedError<
	typeof updateCompanySchema
>;

export const createCustomerSchema = z.object({
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
export const updateCustomerSchema = createCustomerSchema.omit({
	createdAt: true,
});
export type CreateCustomerSchemaErrors = z.inferFormattedError<
	typeof createCustomerSchema
>;
export type UpdateCustomerSchemaErrors = z.inferFormattedError<
	typeof updateCustomerSchema
>;

export const createServiceSchema = z.object({
	id: z.string(),
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional(),
	rate: z.number().min(0, 'Rate must be greater than or equal to 0'),
	createdAt: z.string(),
	updatedAt: z.string(),
});
export const updateServiceSchema = createServiceSchema.omit({
	createdAt: true,
});
export type CreateServiceSchemaErrors = z.inferFormattedError<
	typeof createServiceSchema
>;
export type UpdateServiceSchemaErrors = z.inferFormattedError<
	typeof updateServiceSchema
>;

export const newInvoiceLoaderSchema = z.object({
	companiesLength: z.number().min(1),
	customersLength: z.number().min(1),
	servicesLength: z.number().min(1),
});
export type NewInvoiceLoaderSchemaErrors = z.inferFormattedError<
	typeof newInvoiceLoaderSchema
>;
