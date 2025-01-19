import * as v from 'valibot';
import { ulid } from 'ulid';
import { identifierTypesList, localesList } from '~/lib/constants';
import { currencies } from '~/lib/currencies';
import { invoiceServiceIntents } from './components/InvoiceServicesTable';
import {
	dueDateGteToDate,
	lastIncrementalInvoiceIdGteToZero,
	oneCompanyAtLeast,
	oneCustomerAtLeast,
	oneServiceAtLeast,
	oneTaxAtLeast,
	quantityGteToZero,
	requiredAtLeastOneService,
	requiredCompany,
	requiredCurrencyCountryCode,
	requiredCustomer,
	requiredDate,
	requiredIntent,
	requiredInvoiceId,
	requiredInvoiceIdType,
	requiredInvoiceServiceId,
	requiredLanguage,
	requiredLastIncrementalInvoiceId,
	requiredName,
	requiredQuantity,
	requiredService,
	requiredSubtotalAmount,
	requiredTax,
	requiredTotalAmount,
	subtotalAmountGteToZero,
	totalAmountGteToZero,
} from '~/lib/errors';

export const InvoiceLoaderSchema = v.object({
	companies: v.pipe(
		v.array(
			v.object({
				companyId: v.pipe(v.string(), v.ulid()),
				name: v.pipe(v.string(requiredName), v.nonEmpty(requiredName)),
			}),
		),
		v.minLength(1, oneCompanyAtLeast),
	),
	customers: v.pipe(
		v.array(
			v.object({
				customerId: v.pipe(v.string(), v.ulid()),
				name: v.pipe(v.string(requiredName), v.nonEmpty(requiredName)),
			}),
		),
		v.minLength(1, oneCustomerAtLeast),
	),
	services: v.pipe(
		v.array(
			v.object({
				serviceId: v.pipe(v.string(), v.ulid()),
				name: v.pipe(v.string(requiredName), v.nonEmpty(requiredName)),
				rate: v.number(),
			}),
		),
		v.minLength(1, oneServiceAtLeast),
	),
	taxes: v.pipe(
		v.array(
			v.object({
				taxId: v.pipe(v.string(), v.ulid()),
				name: v.pipe(v.string(requiredName), v.nonEmpty(requiredName)),
				rate: v.number(),
			}),
		),
		v.minLength(1, oneTaxAtLeast),
	),
	lastIncrementalInvoiceId: v.pipe(
		v.number(requiredLastIncrementalInvoiceId),
		v.minValue(0, lastIncrementalInvoiceIdGteToZero),
	),
});

const CreateOrUpdateInvoiceServiceFormSchema = v.object({
	'invoice-service-id': v.pipe(v.string(), v.ulid()),
	intent: v.picklist(
		[invoiceServiceIntents.create, invoiceServiceIntents.update],
		requiredIntent,
	),
	'invoice-id': v.pipe(v.string(requiredInvoiceId), v.ulid(requiredInvoiceId)),
	'service-id': v.pipe(v.string(requiredService), v.ulid(requiredService)),
	quantity: v.pipe(
		v.string(requiredQuantity),
		v.decimal(requiredQuantity),
		v.transform(Number),
		v.minValue(0, quantityGteToZero),
	),
	'tax-id': v.pipe(v.string(requiredTax), v.ulid(requiredTax)),
});

const DeleteInvoiceServiceFormSchema = v.object({
	'invoice-service-id': v.pipe(
		v.string(requiredInvoiceServiceId),
		v.ulid(requiredInvoiceServiceId),
	),
	intent: v.literal(invoiceServiceIntents.delete, requiredIntent),
});

const InvoiceServiceFormSchema = v.pipe(
	v.variant('intent', [
		CreateOrUpdateInvoiceServiceFormSchema,
		DeleteInvoiceServiceFormSchema,
	]),
	v.transform((input) => {
		if (input.intent === invoiceServiceIntents.delete) {
			return {
				invoiceServiceId: input['invoice-service-id'],
				intent: input.intent,
			};
		}

		return {
			invoiceServiceId: input['invoice-service-id'],
			invoiceId: input['invoice-id'],
			serviceId: input['service-id'],
			quantity: Number(input.quantity),
			taxId: input['tax-id'],
			intent: input.intent,
		};
	}),
);
type InvoiceServiceFormInput = v.InferInput<typeof InvoiceServiceFormSchema>;

export const InvoiceFormSchema = v.pipe(
	v.looseObject({
		'invoice-id': v.optional(v.pipe(v.string(), v.ulid())),
		identifier: v.pipe(
			v.string(requiredInvoiceId),
			v.nonEmpty(requiredInvoiceId),
		),
		'identifier-type': v.picklist(
			identifierTypesList.map(({ id }) => id),
			requiredInvoiceIdType,
		),
		locale: v.picklist(
			localesList.map(({ id }) => id),
			requiredLanguage,
		),
		'currency-country-code': v.picklist(
			currencies.map(({ id }) => id),
			requiredCurrencyCountryCode,
		),
		date: v.pipe(v.string(requiredDate), v.isoDate(requiredDate)),
		'due-date': v.optional(v.string()),
		'company-id': v.pipe(
			v.string(requiredCompany),
			v.nonEmpty(requiredCompany),
		),
		'customer-id': v.pipe(
			v.string(requiredCustomer),
			v.nonEmpty(requiredCustomer),
		),
		'subtotal-amount': v.pipe(
			v.string(requiredSubtotalAmount),
			v.decimal(requiredSubtotalAmount),
			v.transform(Number),
			v.minValue(0, subtotalAmountGteToZero),
		),
		'total-amount': v.pipe(
			v.string(requiredTotalAmount),
			v.decimal(requiredTotalAmount),
			v.transform(Number),
			v.minValue(0, totalAmountGteToZero),
		),
		note: v.optional(v.string()),
	}),
	v.forward(
		v.partialCheck(
			[['date'], ['due-date']],
			(input) => {
				const { date, 'due-date': dueDate } = input;
				if (!dueDate) {
					return true;
				}

				return new Date(date) <= new Date(dueDate);
			},
			dueDateGteToDate,
		),
		['due-date'],
	),
	v.rawTransform(({ dataset, addIssue, NEVER }) => {
		const entries = Object.entries(dataset.value);
		const invoiceId = dataset.value['invoice-id'] || ulid();

		const services = Object.values(
			entries.reduce(
				(acc, entry) => {
					const [key, value] = entry as [string, string];
					if (!key.startsWith('invoice-service')) {
						return acc;
					}

					const [, index, parsedKey] = key.split('.') as [
						string,
						string,
						keyof InvoiceServiceFormInput,
					];

					if (!acc[index]) {
						acc[index] = {
							[parsedKey]: value,
							'invoice-id': invoiceId,
						};

						return acc;
					}

					acc[index][parsedKey] = value;

					return acc;
				},
				{} as Record<string, Partial<InvoiceServiceFormInput>>,
			),
		);

		const parsedServices = v.safeParse(
			v.pipe(
				v.array(InvoiceServiceFormSchema),
				v.minLength(1, requiredAtLeastOneService),
				v.someItem(
					(service) =>
						service.intent === invoiceServiceIntents.create ||
						service.intent === invoiceServiceIntents.update,
					requiredAtLeastOneService,
				),
			),
			services,
			{ abortPipeEarly: true },
		);

		if (parsedServices.issues) {
			parsedServices.issues.forEach((issue) => {
				addIssue({
					...issue,
					path: issue.path
						? [
								{
									...issue.path[0],
									key: 'invoice-service',
								},
								...issue.path,
							]
						: [
								{
									key: 'invoice-service',
								},
							],
				});
			});

			return NEVER;
		}

		const {
			identifier,
			'identifier-type': identifierType,
			locale,
			'currency-country-code': currencyCountryCode,
			date,
			'due-date': dueDate,
			'company-id': companyId,
			'customer-id': customerId,
			'subtotal-amount': subtotalAmount,
			'total-amount': totalAmount,
			note,
		} = dataset.value;

		return {
			invoiceId,
			identifier,
			identifierType,
			locale,
			currencyCountryCode,
			date,
			dueDate,
			companyId,
			customerId,
			services: parsedServices.output,
			subtotalAmount,
			totalAmount,
			note,
		};
	}),
);
