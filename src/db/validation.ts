import { taxesTable } from "@db/schema";
import { createInsertSchema } from "drizzle-valibot";
import * as v from "valibot";

export const taxInsertSchema = createInsertSchema(taxesTable, {
	name: (schema) => v.pipe(schema, v.nonEmpty("Name is required")),
	rate: v.pipe(
		v.string(),
		v.nonEmpty("Rate is required"),
		v.decimal("Rate must be a number"),
		v.transform(Number),
		v.minValue(0, "Rate must be greater than 0"),
	),
});
