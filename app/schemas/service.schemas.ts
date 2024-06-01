import { z } from 'zod';

export const createServiceSchema = z.object({
	id: z.string(),
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional(),
	rate: z.number().min(0, 'Rate must be greater than or equal to 0'),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type CreateServiceSchemaErrors = z.inferFormattedError<
	typeof createServiceSchema
>;

export const updateServiceSchema = createServiceSchema.omit({
	createdAt: true,
});

export type UpdateServiceSchemaErrors = z.inferFormattedError<
	typeof updateServiceSchema
>;
