import * as sql from '~/sql/taxes/taxes.sql';
import { emptyResult, itemsPerPage } from '~/lib/pagination';
import type { Tax, PaginatedResult } from '~/types';

type TaxesCountResult = [
	{
		'COUNT(tax_id)': number;
	},
];

async function getTaxesCount() {
	const taxesCount = await window.db.select<TaxesCountResult>(
		sql.taxesCountQuery,
	);

	return taxesCount[0]['COUNT(tax_id)'];
}

export async function getAllTaxes() {
	return window.db.select<Array<Pick<Tax, 'taxId' | 'name'>>>(
		sql.allTaxesQuery,
	);
}

async function getPaginatedTaxes(startCursor: string = '') {
	return window.db.select<Array<Tax>>(sql.taxesQuery, [
		startCursor,
		itemsPerPage,
	]);
}

async function hasPreviousTaxesPage(startCursor: string = '') {
	const hasPreviousTaxesCount = await window.db.select<TaxesCountResult>(
		sql.taxesHasPreviousPageQuery,
		[startCursor, itemsPerPage],
	);

	return Boolean(hasPreviousTaxesCount[0]['COUNT(tax_id)']);
}

async function hasNextTaxesPage(endCursor: string) {
	const hasNextTaxesCount = await window.db.select<TaxesCountResult>(
		sql.taxesHasNextPageQuery,
		[endCursor, itemsPerPage],
	);

	return Boolean(hasNextTaxesCount[0]['COUNT(tax_id)']);
}

export async function getTaxes(
	startCursor: string = '',
): Promise<PaginatedResult<Tax>> {
	const [taxesData, taxesTotal] = await Promise.all([
		getPaginatedTaxes(startCursor),
		getTaxesCount(),
	]);

	if (!taxesData.length) {
		return emptyResult as PaginatedResult<Tax>;
	}

	const endCursor = taxesData[taxesData.length - 1].taxId;

	const [hasPreviousPage, hasNextPage] = await Promise.all([
		hasPreviousTaxesPage(startCursor),
		hasNextTaxesPage(endCursor),
	]);

	return {
		items: taxesData,
		total: taxesTotal,
		pageInfo: {
			endCursor,
			hasNextPage,
			hasPreviousPage,
			startCursor,
		},
	};
}

export async function getTax(taxId: string) {
	const taxesData = await window.db.select<Array<Tax>>(sql.taxQuery, [taxId]);

	if (!taxesData.length) {
		return undefined;
	}

	return taxesData[0];
}

type CreateTaxInput = Omit<Tax, 'createdAt' | 'updatedAt'>;

export async function createTax(tax: CreateTaxInput) {
	return window.db.execute(sql.createTaxMutation, [
		tax.taxId,
		tax.name,
		tax.rate,
	]);
}

type UpdateTaxInput = Omit<Tax, 'createdAt' | 'updatedAt'>;

export async function updateTax(tax: UpdateTaxInput) {
	return window.db.execute(sql.updateTaxMutation, [
		tax.name,
		tax.rate,
		tax.taxId,
	]);
}

export async function deleteTax(taxId: string) {
	return window.db.execute(sql.deleteTaxMutation, [taxId]);
}
