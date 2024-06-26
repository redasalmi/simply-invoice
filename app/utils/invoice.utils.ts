import { ulid } from 'ulid';
import { type z } from 'zod';
import { type IdType } from '~/lib/constants';
import { db } from '~/lib/db';
import type {
	CreateInvoiceSchemaErrors,
	NewInvoiceLoaderSchemaErrors,
} from '~/schemas/invoice.schemas';

export async function getInvoiceClientLoaderData() {
	const [companies, customers, services, invoice] = await Promise.all([
		db.companies.toArray(),
		db.customers.toArray(),
		db.services.toArray(),
		db.invoices.where({ invoiceIdType: 'incremental' as IdType }).last(), // TODO: should get the biggest number instead of the last one x)
	]);

	return {
		companies,
		customers,
		services,
		lastInvoiceId: invoice?.id ? Number(invoice.id) : 0,
	};
}

export function parseCreateInvoiceLoaderErrors(err: z.ZodError) {
	const zodErrors: NewInvoiceLoaderSchemaErrors = err.format();
	const errorsType: Array<string> = [];

	if (zodErrors.companiesLength?._errors?.[0]) {
		errorsType.push('company');
	}
	if (zodErrors.customersLength?._errors?.[0]) {
		errorsType.push('customer');
	}
	if (zodErrors.servicesLength?._errors?.[0]) {
		errorsType.push('service');
	}

	const error = `At least one ${errorsType.join(', ')} need${errorsType.length > 1 ? 's' : ''} to be available to create an invoice! Please create the needed data to move forward and enable invoice creation.`;

	return error;
}

export function parseCreateInvoiceForm(formData: FormData) {
	const today = new Date().toISOString();

	const invoice = {
		id: ulid(),
		invoiceIdType: formData.get('invoice-id-type')?.toString(),
		invoiceId: formData.get('invoice-id')?.toString(),

		locale: formData.get('locale')?.toString(),
		countryCode: formData.get('country-code')?.toString(),

		invoiceDate: formData.get('invoice-date')?.toString(),
		dueDate: formData.get('due-date')?.toString(),
		// dateFormat: formData.get('date-format')?.toString(), // TODO: add a date format field with en and fr formats

		companyId: formData.get('company-id')?.toString(),
		customerId: formData.get('customer-id')?.toString(),

		shipping: Number(formData.get('shipping')?.toString()),
		tax: Number(formData.get('tax')?.toString()),

		note: formData.get('note')?.toString(),
		createdAt: today,
		updatedAt: today,
	};

	const serviceFields: Record<
		string,
		{ id: string; serviceId: string; quantity: number }
	> = {};
	Array.from(formData).forEach(([key, value]) => {
		if (key.includes('service-')) {
			const entryValue = value.toString();
			const id = key
				.replace('service-id-', '')
				.replace('service-quantity-', '');

			if (!serviceFields[id]) {
				serviceFields[id] = { id };
			}

			if (key === `service-id-${id}`) {
				serviceFields[id].serviceId = entryValue;
			} else if (key === `service-quantity-${id}`) {
				serviceFields[id].quantity = Number(entryValue);
			}
		}
	});

	if (Object.keys(serviceFields).length) {
		invoice.services = Object.values(serviceFields);
	}

	return invoice;
}

type ServicesErrors = Record<string, { service?: string; quantity?: string }>;

type ActionErrors = {
	'invoice-id-type'?: string;
	'invoice-id'?: string;
	locale?: string;
	'country-code'?: string;
	'invoice-date'?: string;

	'company-id'?: string;
	'customer-id'?: string;
	service?: string;
	services?: ServicesErrors;

	shipping?: string;
	tax?: string;
};

export function parseCreateInvoiceErrors(err: z.ZodError) {
	const zodErrors: CreateInvoiceSchemaErrors = err.format();

	const errors: ActionErrors = {};
	const servicesErrors: ServicesErrors = {};

	if (zodErrors.services) {
		if (zodErrors.services._errors?.[0]) {
			errors.service = zodErrors.services._errors[0];
		} else {
			for (const [key, value] of Object.entries(zodErrors.services)) {
				if (key === '_errors') {
					continue;
				}

				if (!Array.isArray(value)) {
					servicesErrors[key] = {};
					if (value?.serviceId?._errors?.[0]) {
						servicesErrors[key].service = value.serviceId._errors[0];
					}

					if (value?.quantity?._errors?.[0]) {
						servicesErrors[key].quantity = value.quantity._errors[0];
					}
				}
			}
		}
	}

	if (zodErrors.invoiceIdType?._errors?.[0]) {
		errors['invoice-id-type'] = zodErrors.invoiceIdType._errors[0];
	}
	if (zodErrors.invoiceId?._errors?.[0]) {
		errors['invoice-id'] = zodErrors.invoiceId._errors[0];
	}
	if (zodErrors.locale?._errors?.[0]) {
		errors.locale = zodErrors.locale._errors[0];
	}
	if (zodErrors.countryCode?._errors?.[0]) {
		errors['country-code'] = zodErrors.countryCode._errors[0];
	}
	if (zodErrors.invoiceDate?._errors?.[0]) {
		errors['invoice-date'] = zodErrors.invoiceDate._errors[0];
	}

	if (zodErrors.companyId?._errors?.[0]) {
		errors['company-id'] = zodErrors.companyId._errors[0];
	}
	if (zodErrors.customerId?._errors?.[0]) {
		errors['customer-id'] = zodErrors.customerId._errors[0];
	}

	if (zodErrors.shipping?._errors?.[0]) {
		errors.shipping = zodErrors.shipping._errors[0];
	}
	if (zodErrors.tax?._errors?.[0]) {
		errors.tax = zodErrors.tax._errors[0];
	}

	if (Object.keys(servicesErrors).length) {
		errors.services = servicesErrors;
	}

	return errors;
}
