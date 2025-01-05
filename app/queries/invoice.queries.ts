import * as sql from '~/sql/invoices/invoices.sql';
import type { Invoice } from '~/types';

type LastIncrementalInvoiceIdResult = [
	{
		'MAX(identifier)': string | null;
	},
];

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
