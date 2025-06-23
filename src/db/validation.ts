import { createInsertSchema } from "drizzle-valibot";
import * as v from "valibot";
import { taxesTable } from "~/db/schema";

export const taxCreateSchema = createInsertSchema(taxesTable, {
	name: (schema) => v.pipe(schema, v.nonEmpty("Name is required")),
	rate: v.pipe(
		v.string(),
		v.nonEmpty("Rate is required"),
		v.decimal("Rate must be a number"),
		v.transform(Number),
		v.minValue(0, "Rate must be greater than 0"),
	),
});

export const taxUpdateSchema = v.object({
	...taxCreateSchema.entries,
	taxId: v.pipe(v.string(), v.nonEmpty("Tax ID is required"), v.ulid()),
});

export const taxDeleteSchema = v.pipe(
	v.string(),
	v.nonEmpty("Tax ID is required"),
	v.ulid(),
);
