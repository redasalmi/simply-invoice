import invoicesCountQuery from '~/routes/invoices/queries/invoicesCountQuery.sql?raw';
import nextInvoicesCountQuery from '~/routes/invoices/queries/nextInvoicesCountQuery.sql?raw';
import previousInvoicesCountQuery from '~/routes/invoices/queries/previousInvoicesCountQuery.sql?raw';
import firstInvoicesQuery from '~/routes/invoices/queries/firstInvoicesQuery.sql?raw';
import previousInvoicesQuery from '~/routes/invoices/queries/previousInvoicesQuery.sql?raw';
import nextInvoicesQuery from '~/routes/invoices/queries/nextInvoicesQuery.sql?raw';
import invoiceQuery from '~/routes/invoices/queries/invoiceQuery.sql?raw';
import lastIncrementalInvoiceIdQuery from '~/routes/invoices/queries/lastIncrementalInvoiceIdQuery.sql?raw';
import createInvoiceMutation from '~/routes/invoices/queries/createInvoiceMutation.sql?raw';
import updateInvoiceMutation from '~/routes/invoices/queries/updateInvoiceMutation.sql?raw';
import deleteInvoiceMutation from '~/routes/invoices/queries/deleteInvoiceMutation.sql?raw';
import createInvoiceServiceMutation from '~/routes/invoices/queries/createInvoiceServiceMutation.sql?raw';
import updateInvoiceServiceMutation from '~/routes/invoices/queries/updateInvoiceServiceMutation.sql?raw';
import deleteInvoiceServiceMutation from '~/routes/invoices/queries/deleteInvoiceServiceMutation.sql?raw';
import {
	emptyResult,
	itemsPerPage,
	type PaginationType,
} from '~/lib/pagination';
import type {
	Customer,
	DBInvoice,
	DBInvoiceService,
	Invoice,
	PaginatedResult,
} from '~/types';

interface InvoicesQueryResult
	extends Pick<
		DBInvoice,
		'invoiceId' | 'identifier' | 'currencyCountryCode' | 'date'
	> {
	cost: string;
	customer: string;
}

interface InvoiceQueryResult
	extends Omit<
		DBInvoice,
		'subtotalAmount' | 'totalAmount' | 'createdAt' | 'updatedAt'
	> {
	services: string;
}

type InvoicesCountQueryResult = [
	{
		'COUNT(invoice_id)': number;
	},
];

type LastIncrementalInvoiceIdResult = [
	{
		'MAX(identifier)': string | null;
	},
];

interface ParsedInvoicesQueryResult
	extends Pick<
		Invoice,
		'invoiceId' | 'identifier' | 'currencyCountryCode' | 'date'
	> {
	customer: Pick<Customer, 'email'>;
	cost: Pick<Invoice['cost'], 'totalAmount'>;
}

interface ParsedInvoiceQueryResult
	extends Omit<
		Invoice,
		'company' | 'customer' | 'services' | 'cost' | 'createdAt' | 'updatedAt'
	> {
	companyId: string;
	customerId: string;
	services: Array<{
		invoiceServiceId: string;
		serviceId: string;
		quantity: number;
		taxId: string;
	}>;
}

function parseInvoicesQueryResult(
	invoicesData: Array<InvoicesQueryResult>,
): Array<ParsedInvoicesQueryResult> {
	return invoicesData.map(
		({ invoiceId, identifier, currencyCountryCode, date, customer, cost }) => ({
			invoiceId,
			identifier,
			currencyCountryCode,
			date,
			customer: JSON.parse(customer),
			cost: JSON.parse(cost),
		}),
	);
}

function parseInvoiceQueryResult(
	invoiceData: InvoiceQueryResult,
): ParsedInvoiceQueryResult {
	const { note, services, ...invoice } = invoiceData;

	return Object.assign({}, invoice, {
		note: note ? JSON.parse(note) : undefined,
		services: JSON.parse(services),
	});
}

async function getInvoicesCount() {
	const invoicesCount =
		await window.db.select<InvoicesCountQueryResult>(invoicesCountQuery);

	return invoicesCount[0]['COUNT(invoice_id)'];
}

async function getPreviousInvoices(startCursor: string) {
	return window.db.select<Array<InvoicesQueryResult>>(previousInvoicesQuery, [
		startCursor,
		itemsPerPage,
	]);
}

async function getNextInvoices(endCursor: string) {
	return window.db.select<Array<InvoicesQueryResult>>(nextInvoicesQuery, [
		endCursor,
		itemsPerPage,
	]);
}

async function getFirstInvoices() {
	return window.db.select<Array<InvoicesQueryResult>>(firstInvoicesQuery, [
		itemsPerPage,
	]);
}

async function getPreviousInvoicesCount(startCursor: string) {
	const previousInvoicesCount =
		await window.db.select<InvoicesCountQueryResult>(
			previousInvoicesCountQuery,
			[startCursor, itemsPerPage],
		);

	return previousInvoicesCount[0]['COUNT(invoice_id)'];
}

async function getNextInvoicesCount(endCursor: string) {
	const nextInvoicesCount = await window.db.select<InvoicesCountQueryResult>(
		nextInvoicesCountQuery,
		[endCursor, itemsPerPage],
	);

	return nextInvoicesCount[0]['COUNT(invoice_id)'];
}

export async function getInvoices(
	cursor: string | null,
	paginationType: PaginationType | null,
): Promise<PaginatedResult<ParsedInvoicesQueryResult>> {
	const [invoicesData, invoicesTotal] = await Promise.all([
		cursor && paginationType
			? paginationType === 'previous'
				? getPreviousInvoices(cursor)
				: getNextInvoices(cursor)
			: getFirstInvoices(),
		getInvoicesCount(),
	]);

	if (!invoicesData.length) {
		return emptyResult as PaginatedResult<ParsedInvoicesQueryResult>;
	}

	const startCursor = invoicesData[0].invoiceId;
	const endCursor = invoicesData[invoicesData.length - 1].invoiceId;

	const [previousInvoicesCount, nextInvoicesCount] = await Promise.all([
		getPreviousInvoicesCount(startCursor),
		getNextInvoicesCount(endCursor),
	]);

	const invoices = parseInvoicesQueryResult(invoicesData);

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
	const invoicesData = await window.db.select<Array<InvoiceQueryResult>>(
		invoiceQuery,
		[invoiceId],
	);

	if (!invoicesData.length) {
		return undefined;
	}

	const invoice = parseInvoiceQueryResult(invoicesData[0]);

	return invoice;
}

export async function getLastIncrementalInvoiceId() {
	const lastIdResult = await window.db.select<LastIncrementalInvoiceIdResult>(
		lastIncrementalInvoiceIdQuery,
	);
	const lastId = lastIdResult[0]['MAX(identifier)'];

	return Number(lastId || 0);
}

type createInvoiceInput = Omit<DBInvoice, 'createdAt' | 'updatedAt'>;

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

type UpdateInvoiceInput = Omit<DBInvoice, 'createdAt' | 'updatedAt'>;

export async function updateInvoice(invoice: UpdateInvoiceInput) {
	return window.db.execute(updateInvoiceMutation, [
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
		invoice.invoiceId,
	]);
}

export async function deleteInvoice(invoiceId: string) {
	return window.db.execute(deleteInvoiceMutation, [invoiceId]);
}

type CreateInvoiceServiceInput = Omit<
	DBInvoiceService,
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
	DBInvoiceService,
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

export async function deleteInvoiceService(invoiceServiceId: string) {
	return window.db.execute(deleteInvoiceServiceMutation, [invoiceServiceId]);
}
