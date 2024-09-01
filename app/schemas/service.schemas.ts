import { z } from 'zod';

export const serviceFormSchema = z.object({
	name: z.coerce
		.string({ required_error: 'Name is required' })
		.min(1, 'Name is required'),
	description: z.coerce.string().optional(),
	rate: z
		.string()
		.min(1, 'Rate is required')
		.pipe(
			z.coerce
				.number({
					required_error: 'Rate is required',
				})
				.min(0, 'Rate must be greater than or equal to 0'),
		),
});

export type ServiceFormSchemaErrors = z.inferFormattedError<
	typeof serviceFormSchema
>;
