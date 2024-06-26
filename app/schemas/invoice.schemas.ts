import { z } from 'zod';

export const newInvoiceLoaderSchema = z.object({
	companiesLength: z.number().min(1),
	customersLength: z.number().min(1),
	servicesLength: z.number().min(1),
});

export type NewInvoiceLoaderSchemaErrors = z.inferFormattedError<
	typeof newInvoiceLoaderSchema
>;

export const createInvoiceSchema = z.object({
	id: z.string(),
	invoiceIdType: z.string().min(1, 'Invoice ID type is required'),
	invoiceId: z.string().min(1, 'Invoice ID is required'),
	locale: z.string().min(1, 'Invoice Language is required'),
	countryCode: z.string().min(1, 'Currency is required'),

	invoiceDate: z.string().min(1, 'Invoice Date is required'),
	dueDate: z.string().optional(),
	dateFormat: z.string().optional(),

	companyId: z.string().min(1, 'Please select a company'),
	customerId: z.string().min(1, 'Please select a customer'),

	services: z
		.array(
			z.object({
				id: z.string(),
				serviceId: z.string().min(1, 'Please select a service'),
				quantity: z.number().gt(0, 'Quantity must be higher than 0'),
			}),
			{ message: 'At least one service must be added' },
		)
		.nonempty({ message: 'At least one service must be added' }),

	shipping: z
		.number()
		.min(0, 'Shipping must be higher or equal to 0')
		.optional(),
	tax: z
		.number()
		.min(0, 'Tax must be higher or equal to 0')
		.max(100, 'Tax must be lower or equal to 100')
		.optional(),

	note: z.string().optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type CreateInvoiceSchemaErrors = z.inferFormattedError<
	typeof createInvoiceSchema
>;
