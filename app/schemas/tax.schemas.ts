import * as v from 'valibot';
import { ulid } from 'ulid';

export const TaxFormSchema = v.pipe(
	v.object({
		'tax-id': v.optional(v.pipe(v.string(), v.ulid()), ulid()),
		name: v.pipe(v.string(), v.nonEmpty('Name is required')),
		rate: v.pipe(
			v.string('Rate is required'),
			v.decimal('Rate is required'),
			v.transform(Number),
			v.minValue(0, 'Rate must be greater than or equal to 0'),
		),
	}),
	v.transform((input) => {
		return {
			taxId: input['tax-id'],
			name: input['name'],
			rate: input['rate'],
		};
	}),
);
