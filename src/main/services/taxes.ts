import { db } from "@db/config";
import { type InsertTax, taxesTable } from "@db/schema";
import { asc, count, gt } from "drizzle-orm";

export function getTaxes(cursor?: string, pageSize = 10) {
	return db
		.select()
		.from(taxesTable)
		.where(cursor ? gt(taxesTable.taxId, cursor) : undefined)
		.limit(pageSize)
		.orderBy(asc(taxesTable.taxId));
}

export function getTaxesCount() {
	return db.select({ count: count() }).from(taxesTable);
}

export function createTax(tax: InsertTax) {
	return db.insert(taxesTable).values(tax);
}
