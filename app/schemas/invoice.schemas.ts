import * as v from 'valibot';
import { ulid } from 'ulid';

type InvoiceService = {
	invoiceServiceId: string;
	serviceId: string;
	quantity: string;
	taxId: string;
};

export const CreateInvoiceLoaderSchema = v.object({
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

export const InvoiceFormSchema = v.pipe(
	v.looseObject({
		'invoice-id': v.optional(v.pipe(v.string(), v.ulid())),
		identifier: v.pipe(v.string(), v.nonEmpty('Invoice ID is required')),
		'identifier-type': v.pipe(
			v.string(),
			v.nonEmpty('Invoice ID type is required'),
		),
		locale: v.pipe(v.string(), v.nonEmpty('Invoice language is required')),
		'country-code': v.pipe(v.string(), v.nonEmpty('Currency is required')),
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
		const servicesObject: Record<string, Partial<InvoiceService>> = {};
		const issues: Array<{ key: string; message: string }> = [];

		for (let index = 0; index < entries.length; index++) {
			const [key, value] = entries[index] as [string, string];
			if (!key.startsWith('service-')) {
				continue;
			}

			const splitKey = key.split('-');
			const id = splitKey[splitKey.length - 1];

			if (key.includes('service-invoice-service-id')) {
				servicesObject[id] = {
					invoiceServiceId: id,
				};
				const parsedInvoiceServiceId = v.safeParse(
					v.pipe(v.string(), v.nonEmpty('Invoice service ID is required')),
					value,
				);

				if (parsedInvoiceServiceId.issues) {
					parsedInvoiceServiceId.issues.forEach((issue) => {
						issues.push({
							key,
							message: issue.message,
						});
					});
				}
			} else if (key.includes('service-service-id')) {
				servicesObject[id].serviceId = value;
				const parsedServiceId = v.safeParse(
					v.pipe(v.string(), v.nonEmpty('Service ID is required')),
					value,
				);

				if (parsedServiceId.issues) {
					parsedServiceId.issues.forEach((issue) => {
						issues.push({
							key,
							message: issue.message,
						});
					});
				}
			} else if (key.includes('service-quantity')) {
				servicesObject[id].quantity = value;
				const parsedQuantity = v.safeParse(
					v.pipe(
						v.string('Quantity is required'),
						v.decimal('Quantity is required'),
						v.transform(Number),
						v.minValue(0, 'Quantity must be greater than or equal to 0'),
					),
					value,
				);

				if (parsedQuantity.issues) {
					parsedQuantity.issues.forEach((issue) => {
						issues.push({
							key,
							message: issue.message,
						});
					});
				}
			} else if (key.includes('service-tax-id')) {
				servicesObject[id].taxId = value;
				const parsedTaxId = v.safeParse(
					v.pipe(v.string(), v.nonEmpty('Tax ID is required')),
					value,
				);

				if (parsedTaxId.issues) {
					parsedTaxId.issues.forEach((issue) => {
						issues.push({
							key,
							message: issue.message,
						});
					});
				}
			}
		}

		if (issues.length) {
			issues.forEach(({ key, message }) => {
				addIssue({
					message,
					path: [
						{
							type: 'object',
							origin: 'value',
							input: dataset.value,
							key: key,
							value: dataset.value[key],
						},
					],
				});
			});

			return NEVER;
		}

		const {
			'invoice-id': invoiceId,
			identifier,
			'identifier-type': identifierType,
			locale,
			'country-code': countryCode,
			date,
			'due-date': dueDate,
			'company-id': companyId,
			'customer-id': customerId,
			'subtotal-amount': subtotalAmount,
			'total-amount': totalAmount,
			note,
		} = dataset.value;
		const services = Object.values(servicesObject) as Array<InvoiceService>;

		return {
			invoiceId: invoiceId || ulid(),
			identifier,
			identifierType,
			locale,
			countryCode,
			date,
			dueDate,
			companyId,
			customerId,
			services,
			subtotalAmount,
			totalAmount,
			note,
		};
	}),
);
