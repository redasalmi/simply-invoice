import invoicesCountQuery from '~/sql/invoices/invoicesCountQuery.sql?raw';
import invoicesHasNextPageQuery from '~/sql/invoices/invoicesHasNextPageQuery.sql?raw';
import invoicesHasPreviousPageQuery from '~/sql/invoices/invoicesHasPreviousPageQuery.sql?raw';
import invoicesQuery from '~/sql/invoices/invoicesQuery.sql?raw';
import invoiceQuery from '~/sql/invoices/invoiceQuery.sql?raw';
import lastIncrementalInvoiceIdQuery from '~/sql/invoices/lastIncrementalInvoiceIdQuery.sql?raw';
import createInvoiceMutation from '~/sql/invoices/createInvoiceMutation.sql?raw';
import deleteInvoiceMutation from '~/sql/invoices/deleteInvoiceMutation.sql?raw';

export {
	invoicesCountQuery,
	invoicesHasNextPageQuery,
	invoicesHasPreviousPageQuery,
	invoicesQuery,
	invoiceQuery,
	lastIncrementalInvoiceIdQuery,
	createInvoiceMutation,
	deleteInvoiceMutation,
};
