import * as sql from '~/sql/taxes.sql';
import { emptyResult, itemsPerPage } from '~/lib/pagination';
import type { Tax, PaginatedResult } from '~/types';

type TaxesCountResult = [
	{
		'COUNT(tax_id)': number;
	},
];

export async function getTaxes(
	startCursor: string = '',
): Promise<PaginatedResult<Tax>> {
	const [taxesData, taxesCount] = await Promise.all([
		window.db.select<Array<Tax>>(sql.taxesQuery, [startCursor, itemsPerPage]),
		window.db.select<TaxesCountResult>(sql.taxesCountQuery),
	]);

	if (!taxesData.length) {
		return emptyResult as PaginatedResult<Tax>;
	}

	const endCursor = taxesData[taxesData.length - 1].taxId;

	const [hasPreviousTaxesCount, hasNextTaxesCount] = await Promise.all([
		window.db.select<TaxesCountResult>(sql.taxesHasPreviousPageQuery, [
			startCursor,
			itemsPerPage,
		]),
		window.db.select<TaxesCountResult>(sql.taxesHasNextPageQuery, [
			endCursor,
			itemsPerPage,
		]),
	]);

	const total = taxesCount[0]['COUNT(tax_id)'];
	const hasNextPage = Boolean(hasNextTaxesCount[0]['COUNT(tax_id)']);
	const hasPreviousPage = Boolean(hasPreviousTaxesCount[0]['COUNT(tax_id)']);

	return {
		items: taxesData,
		total,
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
