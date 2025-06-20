import type { ResultSet } from "@libsql/client";
import * as v from "valibot";

export function processAction<
	T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(
	data: v.InferOutput<T>,
	schema: T,
	action: (data: v.InferOutput<T>) => Promise<ResultSet>,
) {
	const parsedData = v.safeParse(schema, data);
	if (!parsedData.success) {
		return {
			errors: v.flatten<typeof schema>(parsedData.issues),
		};
	}

	return action(parsedData.output);
}
