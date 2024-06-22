import { z } from 'zod';

export const createInvoiceSchema = z.object({
	id: z.string(),
	invoiceIdType: z.string({ message: 'Invoice ID type is required' }),
	invoiceId: z.string().min(1, 'Invoice ID is required'),
	locale: z.string({ message: 'Invoice Language is required' }),
	countryCode: z.string({ message: 'Currency is required' }),
	invoiceDate: z.string({ message: 'Invoice Date is required' }),
	dueDate: z.string().optional(),
	companyId: z.string({ message: 'Please select a company' }),
	customerId: z.string({ message: 'Please select a customer' }),
	shipping: z
		.number()
		.min(0, 'Shipping must be higher or equal to zero')
		.optional(),
	tax: z
		.number()
		.min(0, 'Tax must be higher or equal to zero')
		.max(100, 'Tax must be lower or equal to zero')
		.optional(),
	note: z.string().optional(),
});
