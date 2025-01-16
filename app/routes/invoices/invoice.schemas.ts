import * as v from 'valibot';
import { ulid } from 'ulid';
import { identifierTypesList, localesList } from '~/lib/constants';
import { currencies } from '~/lib/currencies';
import { invoiceServiceIntents } from './components/InvoiceServicesTable';

export const InvoiceLoaderSchema = v.object({
	companies: v.pipe(
		v.array(
			v.object({
				companyId: v.pipe(v.string(), v.ulid()),
				name: v.pipe(v.string(), v.nonEmpty('Name is required')),
			}),
		),
		v.minLength(1, 'At least one company must be available!'),
	),
	customers: v.pipe(
		v.array(
			v.object({
				customerId: v.pipe(v.string(), v.ulid()),
				name: v.pipe(v.string(), v.nonEmpty('Name is required')),
			}),
		),
		v.minLength(1, 'At least one customer must be available!'),
	),
	services: v.pipe(
		v.array(
			v.object({
				serviceId: v.pipe(v.string(), v.ulid()),
				name: v.pipe(v.string(), v.nonEmpty('Name is required')),
				rate: v.number(),
			}),
		),
		v.minLength(1, 'At least one service must be available!'),
	),
	taxes: v.pipe(
		v.array(
			v.object({
				taxId: v.pipe(v.string(), v.ulid()),
				name: v.pipe(v.string(), v.nonEmpty('Name is required')),
				rate: v.number(),
			}),
		),
		v.minLength(1, 'At least one tax must be available!'),
	),
	lastIncrementalInvoiceId: v.pipe(
		v.number('lastIncrementalInvoiceId is required'),
		v.minValue(0, 'last ID must be greater than or equal to 0'),
	),
});

const CreateOrUpdateInvoiceServiceFormSchema = v.object({
	'invoice-service-id': v.pipe(v.string(), v.ulid()),
	intent: v.picklist(
		[invoiceServiceIntents.create, invoiceServiceIntents.update],
		'Intent is required',
	),
	'invoice-id': v.pipe(v.string(), v.ulid()),
	'service-id': v.pipe(v.string(), v.ulid('Service is required')),
	quantity: v.pipe(
		v.string('Quantity is required'),
		v.decimal('Quantity is required'),
		v.transform(Number),
		v.minValue(0, 'Quantity must be greater than or equal to 0'),
	),
	'tax-id': v.pipe(v.string(), v.ulid('Tax is required')),
});

const DeleteInvoiceServiceFormSchema = v.object({
	'invoice-service-id': v.pipe(v.string(), v.ulid()),
	intent: v.literal(invoiceServiceIntents.delete, 'Intent is required'),
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
		identifier: v.pipe(v.string(), v.nonEmpty('Invoice ID is required')),
		'identifier-type': v.picklist(
			identifierTypesList.map(({ id }) => id),
			'Invoice ID type is required',
		),
		locale: v.picklist(
			localesList.map(({ id }) => id),
			'Language is required',
		),
		'currency-country-code': v.picklist(
			currencies.map(({ id }) => id),
			'Currency is required',
		),
		date: v.pipe(v.string(), v.isoDate('Date is required')),
		'due-date': v.optional(v.string()),
		'company-id': v.pipe(v.string(), v.nonEmpty('Company is required')),
		'customer-id': v.pipe(v.string(), v.nonEmpty('Customer is required')),
		'subtotal-amount': v.pipe(
			v.string('Subtotal amount is required'),
			v.decimal('Subtotal amount is required'),
			v.transform(Number),
			v.minValue(0, 'Subtotal amount must be greater than or equal to 0'),
		),
		'total-amount': v.pipe(
			v.string('Total amount is required'),
			v.decimal('Total amount is required'),
			v.transform(Number),
			v.minValue(0, 'Total amount must be greater than or equal to 0'),
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
			'Due Date must be bigger than or equal to the invoice date',
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
				v.minLength(1, 'At least one service is required!'),
				v.someItem(
					(service) =>
						service.intent === invoiceServiceIntents.create ||
						service.intent === invoiceServiceIntents.update,
					'At least one service is required!',
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
