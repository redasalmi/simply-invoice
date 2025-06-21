import { db } from "@db/config";
import { taxesTable } from "@db/schema";
import { emptyResult, itemsPerPage } from "@main/utils/pagination";
import type {
	InsertTax,
	PaginatedResult,
	PaginationType,
	UpdateTax,
} from "@types";
import { asc, count, desc, eq, gt, lt } from "drizzle-orm";

async function getTaxesCount() {
	return db.select({ count: count() }).from(taxesTable);
}

async function getPreviousTaxesCount(cursor: string) {
	return db
		.select({ count: count() })
		.from(taxesTable)
		.where(gt(taxesTable.taxId, cursor));
}

async function getNextTaxesCount(cursor: string) {
	return db
		.select({ count: count() })
		.from(taxesTable)
		.where(lt(taxesTable.taxId, cursor));
}

async function getPreviousTaxes(cursor: string | null) {
	return db.query.taxesTable.findMany({
		where: cursor ? gt(taxesTable.taxId, cursor) : undefined,
		orderBy: [asc(taxesTable.taxId)],
		limit: itemsPerPage,
	});
}

async function getNextTaxes(cursor: string | null) {
	return db.query.taxesTable.findMany({
		where: cursor ? lt(taxesTable.taxId, cursor) : undefined,
		orderBy: [desc(taxesTable.taxId)],
		limit: itemsPerPage,
	});
}

export async function getTaxes(
	cursor: string | null,
	paginationType: PaginationType | null,
) {
	const [taxesData, taxesTotal] = await Promise.all([
		paginationType === "previous"
			? getPreviousTaxes(cursor)
			: getNextTaxes(cursor),
		getTaxesCount(),
	]);

	if (!taxesData.length) {
		return emptyResult as PaginatedResult<InsertTax>;
	}

	const startCursor = taxesData[0].taxId;
	const endCursor = taxesData[taxesData.length - 1].taxId;

	const [previousTaxesCount, nextTaxesCount] = await Promise.all([
		getPreviousTaxesCount(startCursor),
		getNextTaxesCount(endCursor),
	]);

	return {
		items: taxesData,
		total: taxesTotal[0].count,
		pageInfo: {
			endCursor,
			hasNextPage: Boolean(nextTaxesCount[0].count),
			hasPreviousPage: Boolean(previousTaxesCount[0].count),
			startCursor,
		},
	};
}

export async function getTax(taxId: string) {
	return db.query.taxesTable.findFirst({ where: eq(taxesTable.taxId, taxId) });
}

export async function createTax(tax: InsertTax) {
	return db.insert(taxesTable).values(tax);
}

export async function updateTax(tax: UpdateTax) {
	return db.update(taxesTable).set(tax).where(eq(taxesTable.taxId, tax.taxId));
}
