import * as sql from '~/sql/invoices/invoices.sql';
import { emptyResult, itemsPerPage } from '~/lib/pagination';
import type { Customer, Invoice, PaginatedResult } from '~/types';

type InvoiceSelectResult = Pick<
	Invoice,
	'invoiceId' | 'identifier' | 'currencyCountryCode' | 'date'
> & {
	totalAmount: number;
	customerEmail: string;
};

type InvoicesCountResult = [
	{
		'COUNT(invoice_id)': number;
	},
];

type LastIncrementalInvoiceIdResult = [
	{
		'MAX(identifier)': string | null;
	},
];

type PartialInvoice = Pick<
	Invoice,
	'invoiceId' | 'identifier' | 'currencyCountryCode' | 'date'
> & {
	customer: Pick<Customer, 'email'>;
	cost: Pick<Invoice['cost'], 'totalAmount'>;
};

function parseInvoicesSelectResult(
	invoicesData: Array<InvoiceSelectResult>,
): Array<PartialInvoice> {
	return invoicesData.map((invoice) => ({
		invoiceId: invoice.invoiceId,
		identifier: invoice.identifier,
		currencyCountryCode: invoice.currencyCountryCode,
		date: invoice.date,
		customer: {
			email: invoice.customerEmail,
		},
		cost: {
			totalAmount: invoice.totalAmount,
		},
	}));
}

async function getInvoicesCount() {
	const invoicesCount = await window.db.select<InvoicesCountResult>(
		sql.invoicesCountQuery,
	);

	return invoicesCount[0]['COUNT(invoice_id)'];
}

async function getPaginatedInvoices(startCursor: string = '') {
	return window.db.select<Array<InvoiceSelectResult>>(sql.invoicesQuery, [
		startCursor,
		itemsPerPage,
	]);
}

async function hasPreviousInvoicesPage(startCursor: string = '') {
	const hasPreviousInvoicesCount = await window.db.select<InvoicesCountResult>(
		sql.invoicesHasPreviousPageQuery,
		[startCursor, itemsPerPage],
	);

	return Boolean(hasPreviousInvoicesCount[0]['COUNT(invoice_id)']);
}

async function hasNextInvoicesPage(endCursor: string) {
	const hasNextInvoicesCount = await window.db.select<InvoicesCountResult>(
		sql.invoicesHasNextPageQuery,
		[endCursor, itemsPerPage],
	);

	return Boolean(hasNextInvoicesCount[0]['COUNT(invoice_id)']);
}

export async function getInvoices(
	startCursor: string = '',
): Promise<PaginatedResult<PartialInvoice>> {
	const [invoicesData, invoicesTotal] = await Promise.all([
		getPaginatedInvoices(startCursor),
		getInvoicesCount(),
	]);

	if (!invoicesData.length) {
		return emptyResult as PaginatedResult<PartialInvoice>;
	}

	const endCursor = invoicesData[invoicesData.length - 1].invoiceId;

	const [hasPreviousPage, hasNextPage] = await Promise.all([
		hasPreviousInvoicesPage(startCursor),
		hasNextInvoicesPage(endCursor),
	]);

	const invoices = parseInvoicesSelectResult(invoicesData);

	return {
		items: invoices,
		total: invoicesTotal,
		pageInfo: {
			endCursor,
			hasNextPage,
			hasPreviousPage,
			startCursor,
		},
	};
}

export async function getInvoice(invoiceId: string) {
	const invoicesData = await window.db.select<Array<InvoiceSelectResult>>(
		sql.invoiceQuery,
		[invoiceId],
	);

	if (!invoicesData.length) {
		return undefined;
	}

	const invoices = parseInvoicesSelectResult(invoicesData);

	return invoices[0];
}

export async function getLastIncrementalInvoiceId() {
	const lastIdResult = await window.db.select<LastIncrementalInvoiceIdResult>(
		sql.lastIncrementalInvoiceIdQuery,
	);
	const lastId = lastIdResult[0]['MAX(identifier)'];

	return Number(lastId || 0);
}

type createInvoiceInput = Pick<
	Invoice,
	| 'invoiceId'
	| 'identifier'
	| 'identifierType'
	| 'locale'
	| 'currencyCountryCode'
	| 'date'
	| 'dueDate'
> & {
	companyId: string;
	customerId: string;
	subtotalAmount: number;
	totalAmount: number;
	note?: string;
};

export async function createInvoice(invoice: createInvoiceInput) {
	return window.db.execute(sql.createInvoiceMutation, [
		invoice.invoiceId,
		invoice.identifier,
		invoice.identifierType,
		invoice.locale,
		invoice.currencyCountryCode,
		invoice.date,
		invoice.dueDate,
		invoice.companyId,
		invoice.customerId,
		invoice.subtotalAmount,
		invoice.totalAmount,
		invoice.note,
	]);
}

export async function deleteInvoice(invoiceId: string) {
	return window.db.execute(sql.deleteInvoiceMutation, [invoiceId]);
}
