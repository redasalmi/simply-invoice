import invoicesCountQuery from '~/sql/invoices/invoicesCountQuery.sql?raw';
import invoicesHasNextPageQuery from '~/sql/invoices/invoicesHasNextPageQuery.sql?raw';
import invoicesHasPreviousPageQuery from '~/sql/invoices/invoicesHasPreviousPageQuery.sql?raw';
import firstInvoicesQuery from '~/sql/invoices/firstInvoicesQuery.sql?raw';
import previousInvoicesQuery from '~/sql/invoices/previousInvoicesQuery.sql?raw';
import nextInvoicesQuery from '~/sql/invoices/nextInvoicesQuery.sql?raw';
import invoiceQuery from '~/sql/invoices/invoiceQuery.sql?raw';
import lastIncrementalInvoiceIdQuery from '~/sql/invoices/lastIncrementalInvoiceIdQuery.sql?raw';
import createInvoiceMutation from '~/sql/invoices/createInvoiceMutation.sql?raw';
import deleteInvoiceMutation from '~/sql/invoices/deleteInvoiceMutation.sql?raw';

export {
	invoicesCountQuery,
	invoicesHasNextPageQuery,
	invoicesHasPreviousPageQuery,
	firstInvoicesQuery,
	previousInvoicesQuery,
	nextInvoicesQuery,
	invoiceQuery,
	lastIncrementalInvoiceIdQuery,
	createInvoiceMutation,
	deleteInvoiceMutation,
};
