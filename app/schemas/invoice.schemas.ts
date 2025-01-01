import * as v from 'valibot';
// import { z } from 'zod';

// export const newInvoiceLoaderSchema = z.object({
// 	companiesLength: z.number().min(1),
// 	customersLength: z.number().min(1),
// 	servicesLength: z.number().min(1),
// });

// export type NewInvoiceLoaderSchemaErrors = z.inferFormattedError<
// 	typeof newInvoiceLoaderSchema
// >;

// export const createInvoiceSchema = z.object({
// 	id: z.string(),
// 	invoiceIdType: z.string().min(1, 'Invoice ID type is required'),
// 	invoiceId: z.string().min(1, 'Invoice ID is required'),
// 	locale: z.string().min(1, 'Invoice Language is required'),
// 	countryCode: z.string().min(1, 'Currency is required'),

// 	invoiceDate: z.string().min(1, 'Invoice Date is required'),
// 	dueDate: z.string().optional(),
// 	dateFormat: z.string().optional(),

// 	companyId: z.string().min(1, 'Please select a company'),
// 	customerId: z.string().min(1, 'Please select a customer'),

// 	services: z
// 		.array(
// 			z.object({
// 				id: z.string(),
// 				serviceId: z.string().min(1, 'Please select a service'),
// 				quantity: z.number().gt(0, 'Quantity must be higher than 0'),
// 			}),
// 			{ message: 'At least one service must be added' },
// 		)
// 		.nonempty({ message: 'At least one service must be added' }),

// 	shipping: z
// 		.number()
// 		.min(0, 'Shipping must be higher or equal to 0')
// 		.optional(),
// 	tax: z
// 		.number()
// 		.min(0, 'Tax must be higher or equal to 0')
// 		.max(100, 'Tax must be lower or equal to 100')
// 		.optional(),

// 	note: z.string().optional(),
// 	createdAt: z.string(),
// 	updatedAt: z.string(),
// });

// export type CreateInvoiceSchemaErrors = z.inferFormattedError<
// 	typeof createInvoiceSchema
// >;

export const NewInvoiceLoaderSchema = v.object({
	companies: v.pipe(
		v.array(
			v.object({
				companyId: v.pipe(v.string(), v.ulid()),
				name: v.pipe(v.string(), v.nonEmpty('Name is required')),
			}),
		),
		v.minLength(1, 'At least one company must be available!'),
	),
	customers: v.pipe(
		v.array(
			v.object({
				customerId: v.pipe(v.string(), v.ulid()),
				name: v.pipe(v.string(), v.nonEmpty('Name is required')),
			}),
		),
		v.minLength(1, 'At least one customer must be available!'),
	),
	services: v.pipe(
		v.array(
			v.object({
				serviceId: v.pipe(v.string(), v.ulid()),
				name: v.pipe(v.string(), v.nonEmpty('Name is required')),
			}),
		),
		v.minLength(1, 'At least one service must be available!'),
	),
	taxes: v.pipe(
		v.array(
			v.object({
				taxId: v.pipe(v.string(), v.ulid()),
				name: v.pipe(v.string(), v.nonEmpty('Name is required')),
			}),
		),
		v.minLength(1, 'At least one tax must be available!'),
	),
	lastIncrementalInvoiceId: v.pipe(
		v.number('lastIncrementalInvoiceId is required'),
		v.minValue(0, 'last ID must be greater than or equal to 0'),
	),
});
