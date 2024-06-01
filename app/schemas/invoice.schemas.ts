import { z } from 'zod';

export const newInvoiceLoaderSchema = z.object({
	companiesLength: z.number().min(1),
	customersLength: z.number().min(1),
	servicesLength: z.number().min(1),
});

export type NewInvoiceLoaderSchemaErrors = z.inferFormattedError<
	typeof newInvoiceLoaderSchema
>;
