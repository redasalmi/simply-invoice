import * as v from 'valibot';
import { ulid } from 'ulid';
import { rateGteToZero, requiredName, requiredRate } from '~/lib/errors';

export const ServiceFormSchema = v.pipe(
	v.object({
		'service-id': v.optional(v.pipe(v.string(), v.ulid())),
		name: v.pipe(v.string(requiredName), v.nonEmpty(requiredName)),
		description: v.optional(v.string()),
		rate: v.pipe(
			v.string(requiredRate),
			v.decimal(requiredRate),
			v.transform(Number),
			v.minValue(0, rateGteToZero),
		),
	}),
	v.transform((input) => {
		return {
			serviceId: input['service-id'] || ulid(),
			name: input['name'],
			description: input['description'],
			rate: input['rate'],
		};
	}),
);
