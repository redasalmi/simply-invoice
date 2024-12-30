import * as v from 'valibot';
import { ulid } from 'ulid';

export const ServiceFormSchema = v.pipe(
	v.object({
		'service-id': v.optional(v.pipe(v.string(), v.ulid()), ulid()),
		name: v.pipe(v.string(), v.nonEmpty('Name is required')),
		description: v.optional(v.string()),
		rate: v.pipe(
			v.string('Rate is required'),
			v.decimal('Rate is required'),
			v.transform(Number),
			v.minValue(0, 'Rate must be greater than or equal to 0'),
		),
	}),
	v.transform((input) => {
		return {
			serviceId: input['service-id'],
			name: input['name'],
			description: input['description'],
			rate: input['rate'],
		};
	}),
);
