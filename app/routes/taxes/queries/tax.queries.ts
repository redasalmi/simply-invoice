import allTaxesQuery from '~/routes/taxes/queries/allTaxesQuery.sql?raw';
import taxesCountQuery from '~/routes/taxes/queries/taxesCountQuery.sql?raw';
import nextTaxesCountQuery from '~/routes/taxes/queries/nextTaxesCountQuery.sql?raw';
import previousTaxesCountQuery from '~/routes/taxes/queries/previousTaxesCountQuery.sql?raw';
import firstTaxesQuery from '~/routes/taxes/queries/firstTaxesQuery.sql?raw';
import previousTaxesQuery from '~/routes/taxes/queries/previousTaxesQuery.sql?raw';
import nextTaxesQuery from '~/routes/taxes/queries/nextTaxesQuery.sql?raw';
import taxQuery from '~/routes/taxes/queries/taxQuery.sql?raw';
import createTaxMutation from '~/routes/taxes/queries/createTaxMutation.sql?raw';
import deleteTaxMutation from '~/routes/taxes/queries/deleteTaxMutation.sql?raw';
import updateTaxMutation from '~/routes/taxes/queries/updateTaxMutation.sql?raw';
import {
	emptyResult,
	itemsPerPage,
	type PaginationType,
} from '~/lib/pagination';
import type { Tax, PaginatedResult } from '~/types';

type TaxesCountResult = [
	{
		'COUNT(tax_id)': number;
	},
];

async function getTaxesCount() {
	const taxesCount = await window.db.select<TaxesCountResult>(taxesCountQuery);

	return taxesCount[0]['COUNT(tax_id)'];
}

export async function getAllTaxes() {
	return window.db.select<Array<Pick<Tax, 'taxId' | 'name' | 'rate'>>>(
		allTaxesQuery,
	);
}

async function getPreviousTaxes(startCursor: string) {
	return window.db.select<Array<Tax>>(previousTaxesQuery, [
		startCursor,
		itemsPerPage,
	]);
}

async function getNextTaxes(endCursor: string) {
	return window.db.select<Array<Tax>>(nextTaxesQuery, [
		endCursor,
		itemsPerPage,
	]);
}

async function getFirstTaxes() {
	return window.db.select<Array<Tax>>(firstTaxesQuery, [itemsPerPage]);
}

async function getPreviousTaxesCount(startCursor: string) {
	const previousTaxesCount = await window.db.select<TaxesCountResult>(
		previousTaxesCountQuery,
		[startCursor, itemsPerPage],
	);

	return previousTaxesCount[0]['COUNT(tax_id)'];
}

async function getNextTaxesCount(endCursor: string) {
	const nextTaxesCount = await window.db.select<TaxesCountResult>(
		nextTaxesCountQuery,
		[endCursor, itemsPerPage],
	);

	return nextTaxesCount[0]['COUNT(tax_id)'];
}

export async function getTaxes(
	cursor: string | null,
	paginationType: PaginationType | null,
): Promise<PaginatedResult<Tax>> {
	const [taxesData, taxesTotal] = await Promise.all([
		cursor && paginationType
			? paginationType === 'previous'
				? getPreviousTaxes(cursor)
				: getNextTaxes(cursor)
			: getFirstTaxes(),
		getTaxesCount(),
	]);

	if (!taxesData.length) {
		return emptyResult as PaginatedResult<Tax>;
	}

	const startCursor = taxesData[0].taxId;
	const endCursor = taxesData[taxesData.length - 1].taxId;

	const [previousTaxesCount, nextTaxesCount] = await Promise.all([
		getPreviousTaxesCount(startCursor),
		getNextTaxesCount(endCursor),
	]);

	return {
		items: taxesData,
		total: taxesTotal,
		pageInfo: {
			endCursor,
			hasNextPage: Boolean(nextTaxesCount),
			hasPreviousPage: Boolean(previousTaxesCount),
			startCursor,
		},
	};
}

export async function getTax(taxId: string) {
	const taxesData = await window.db.select<Array<Tax>>(taxQuery, [taxId]);

	if (!taxesData.length) {
		return undefined;
	}

	return taxesData[0];
}

type CreateTaxInput = Omit<Tax, 'createdAt' | 'updatedAt'>;

export async function createTax(tax: CreateTaxInput) {
	return window.db.execute(createTaxMutation, [tax.taxId, tax.name, tax.rate]);
}

type UpdateTaxInput = Omit<Tax, 'createdAt' | 'updatedAt'>;

export async function updateTax(tax: UpdateTaxInput) {
	return window.db.execute(updateTaxMutation, [tax.name, tax.rate, tax.taxId]);
}

export async function deleteTax(taxId: string) {
	return window.db.execute(deleteTaxMutation, [taxId]);
}
