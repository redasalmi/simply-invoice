import * as sql from '~/sql/invoice-services/invoice-services.sql';
import type { InvoiceService } from '~/types';

type CreateInvoiceServiceInput = Omit<
	InvoiceService,
	'createdAt' | 'updatedAt'
>;

export async function createInvoiceService(
	invoiceService: CreateInvoiceServiceInput,
) {
	return window.db.execute(sql.createInvoiceServiceMutation, [
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
	return window.db.execute(sql.updateInvoiceServiceMutation, [
		invoiceService.serviceId,
		invoiceService.quantity,
		invoiceService.taxId,
		invoiceService.invoiceServiceId,
	]);
}

export async function deleteInvoiceService(invoiceServiceId: string) {
	return window.db.execute(sql.deleteInvoiceServiceMutation, [
		invoiceServiceId,
	]);
}
