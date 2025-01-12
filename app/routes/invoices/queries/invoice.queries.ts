import invoicesCountQuery from '~/routes/invoices/queries/invoicesCountQuery.sql?raw';
import invoicesHasNextPageQuery from '~/routes/invoices/queries/invoicesHasNextPageQuery.sql?raw';
import invoicesHasPreviousPageQuery from '~/routes/invoices/queries/invoicesHasPreviousPageQuery.sql?raw';
import firstInvoicesQuery from '~/routes/invoices/queries/firstInvoicesQuery.sql?raw';
import previousInvoicesQuery from '~/routes/invoices/queries/previousInvoicesQuery.sql?raw';
import nextInvoicesQuery from '~/routes/invoices/queries/nextInvoicesQuery.sql?raw';
import invoiceQuery from '~/routes/invoices/queries/invoiceQuery.sql?raw';
import lastIncrementalInvoiceIdQuery from '~/routes/invoices/queries/lastIncrementalInvoiceIdQuery.sql?raw';
import createInvoiceMutation from '~/routes/invoices/queries/createInvoiceMutation.sql?raw';
import deleteInvoiceMutation from '~/routes/invoices/queries/deleteInvoiceMutation.sql?raw';
import createInvoiceServiceMutation from '~/routes/invoices/queries/createInvoiceServiceMutation.sql?raw';
import updateInvoiceServiceMutation from '~/routes/invoices/queries/updateInvoiceServiceMutation.sql?raw';
import {
	emptyResult,
	itemsPerPage,
	type PaginationType,
} from '~/lib/pagination';
import type {
	Customer,
	Invoice,
	InvoiceService,
	PaginatedResult,
} from '~/types';

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
	const invoicesCount =
		await window.db.select<InvoicesCountResult>(invoicesCountQuery);

	return invoicesCount[0]['COUNT(invoice_id)'];
}

async function getPreviousInvoices(startCursor: string) {
	return window.db.select<Array<InvoiceSelectResult>>(previousInvoicesQuery, [
		startCursor,
		itemsPerPage,
	]);
}

async function getNextInvoices(endCursor: string) {
	return window.db.select<Array<InvoiceSelectResult>>(nextInvoicesQuery, [
		endCursor,
		itemsPerPage,
	]);
}

async function getFirstInvoices() {
	return window.db.select<Array<InvoiceSelectResult>>(firstInvoicesQuery, [
		itemsPerPage,
	]);
}

async function hasPreviousInvoicesPage(startCursor: string = '') {
	const hasPreviousInvoicesCount = await window.db.select<InvoicesCountResult>(
		invoicesHasPreviousPageQuery,
		[startCursor, itemsPerPage],
	);

	return Boolean(hasPreviousInvoicesCount[0]['COUNT(invoice_id)']);
}

async function hasNextInvoicesPage(endCursor: string) {
	const hasNextInvoicesCount = await window.db.select<InvoicesCountResult>(
		invoicesHasNextPageQuery,
		[endCursor, itemsPerPage],
	);

	return Boolean(hasNextInvoicesCount[0]['COUNT(invoice_id)']);
}

export async function getInvoices(
	cursor: string | null,
	paginationType: PaginationType | null,
): Promise<PaginatedResult<PartialInvoice>> {
	const [invoicesData, invoicesTotal] = await Promise.all([
		cursor && paginationType
			? paginationType === 'previous'
				? getPreviousInvoices(cursor)
				: getNextInvoices(cursor)
			: getFirstInvoices(),
		getInvoicesCount(),
	]);

	if (!invoicesData.length) {
		return emptyResult as PaginatedResult<PartialInvoice>;
	}

	const startCursor = invoicesData[0].invoiceId;
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
		invoiceQuery,
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
		lastIncrementalInvoiceIdQuery,
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
	return window.db.execute(createInvoiceMutation, [
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
	return window.db.execute(deleteInvoiceMutation, [invoiceId]);
}

type CreateInvoiceServiceInput = Omit<
	InvoiceService,
	'createdAt' | 'updatedAt'
>;

export async function createInvoiceService(
	invoiceService: CreateInvoiceServiceInput,
) {
	return window.db.execute(createInvoiceServiceMutation, [
		invoiceService.invoiceServiceId,
		invoiceService.serviceId,
		invoiceService.invoiceId,
		invoiceService.quantity,
		invoiceService.taxId,
	]);
}

type UpdateInvoiceServiceInput = Omit<
	InvoiceService,
	'invoiceId' | 'createdAt' | 'updatedAt'
>;

export async function updateInvoiceService(
	invoiceService: UpdateInvoiceServiceInput,
) {
	return window.db.execute(updateInvoiceServiceMutation, [
		invoiceService.serviceId,
		invoiceService.quantity,
		invoiceService.taxId,
		invoiceService.invoiceServiceId,
	]);
}
