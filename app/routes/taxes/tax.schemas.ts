import * as v from 'valibot';
import { ulid } from 'ulid';
import { rateGteToZero, requiredName, requiredRate } from '~/lib/errors';

export const TaxFormSchema = v.pipe(
	v.object({
		'tax-id': v.optional(v.pipe(v.string(), v.ulid())),
		name: v.pipe(v.string(requiredName), v.nonEmpty(requiredName)),
		rate: v.pipe(
			v.string(requiredRate),
			v.decimal(requiredRate),
			v.transform(Number),
			v.minValue(0, rateGteToZero),
		),
	}),
	v.transform((input) => {
		return {
			taxId: input['tax-id'] || ulid(),
			name: input['name'],
			rate: input['rate'],
		};
	}),
);
