import invoicesCountQuery from '~/routes/invoices/queries/invoicesCountQuery.sql?raw';
import nextInvoicesCountQuery from '~/routes/invoices/queries/nextInvoicesCountQuery.sql?raw';
import previousInvoicesCountQuery from '~/routes/invoices/queries/previousInvoicesCountQuery.sql?raw';
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

async function getPreviousInvoicesCount(startCursor: string) {
	const previousInvoicesCount = await window.db.select<InvoicesCountResult>(
		previousInvoicesCountQuery,
		[startCursor, itemsPerPage],
	);

	return previousInvoicesCount[0]['COUNT(invoice_id)'];
}

async function getNextInvoicesCount(endCursor: string) {
	const nextInvoicesCount = await window.db.select<InvoicesCountResult>(
		nextInvoicesCountQuery,
		[endCursor, itemsPerPage],
	);

	return nextInvoicesCount[0]['COUNT(invoice_id)'];
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

	const [previousInvoicesCount, nextInvoicesCount] = await Promise.all([
		getPreviousInvoicesCount(startCursor),
		getNextInvoicesCount(endCursor),
	]);

	const invoices = parseInvoicesSelectResult(invoicesData);

	return {
		items: invoices,
		total: invoicesTotal,
		pageInfo: {
			endCursor,
			hasNextPage: Boolean(nextInvoicesCount),
			hasPreviousPage: Boolean(previousInvoicesCount),
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
