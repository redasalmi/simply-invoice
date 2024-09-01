import { z } from 'zod';

export const serviceFormSchema = z.object({
	name: z
		.string({ required_error: 'Name is required' })
		.min(1, 'Name is required'),
	description: z.string().optional(),
	rate: z
		.number({ required_error: 'Rate is required' })
		.min(0, 'Rate must be greater than or equal to 0'),
});

export type ServiceFormSchemaErrors = z.inferFormattedError<
	typeof serviceFormSchema
>;
