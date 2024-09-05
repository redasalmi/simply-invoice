import { z } from 'zod';

export const serviceFormSchema = z.object({
	name: z.coerce.string().min(1, 'Name is required'),
	description: z.coerce.string().optional(),
	rate: z
		.string()
		.min(1, 'Rate is required')
		.pipe(z.coerce.number().min(0, 'Rate must be greater than or equal to 0')),
});
