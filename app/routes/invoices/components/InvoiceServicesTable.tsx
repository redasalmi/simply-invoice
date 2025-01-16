import * as React from 'react';
import { ulid } from 'ulid';
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table';
import { Button } from '~/components/ui/button';
import { InvoiceServiceRow } from './InvoiceServiceRow';
import type { Service, Tax } from '~/types';

export const invoiceServiceIntents = {
	create: 'create',
	update: 'update',
	delete: 'delete',
} as const;
export type InvoiceServiceIntent = keyof typeof invoiceServiceIntents;

export type SelectedInvoiceService = {
	invoiceServiceId: string;
	serviceId: string;
	serviceRate: number;
	taxId: string;
	taxRate: number;
	quantity: number;
	intent: InvoiceServiceIntent;
};

type ServicesTablesProps = {
	invoiceServicesList?: Array<SelectedInvoiceService>;
	services: Array<Pick<Service, 'serviceId' | 'name' | 'rate'>>;
	taxes: Array<Pick<Tax, 'taxId' | 'name' | 'rate'>>;
	errors?: Record<string, [string, ...string[]] | undefined>;
	resetErrors: () => void;
};

export function InvoiceServicesTable({
	invoiceServicesList,
	services,
	taxes,
	errors,
	resetErrors,
}: ServicesTablesProps) {
	const [invoiceServices, setInvoiceServices] = React.useState<
		Array<SelectedInvoiceService>
	>(() => {
		if (!invoiceServicesList?.length) {
			return [
				{
					invoiceServiceId: ulid(),
					serviceId: '',
					serviceRate: 0,
					taxId: '',
					taxRate: 0,
					quantity: 0,
					intent: invoiceServiceIntents.create,
				},
			];
		}

		return invoiceServicesList;
	});

	const subtotalAmount = invoiceServices.reduce(
		(acc, { quantity, serviceRate, intent }) => {
			if (intent === invoiceServiceIntents.delete) {
				return acc;
			}

			return acc + quantity * serviceRate;
		},
		0,
	);

	const totalAmount = invoiceServices.reduce(
		(acc, { quantity, serviceRate, taxRate, intent }) => {
			if (intent === invoiceServiceIntents.delete) {
				return acc;
			}

			const subtotal = quantity * serviceRate;

			return acc + subtotal + (subtotal * taxRate) / 100;
		},
		0,
	);

	const addService = () => {
		setInvoiceServices((prevServices) => {
			return prevServices.concat({
				invoiceServiceId: ulid(),
				serviceId: '',
				serviceRate: 0,
				taxId: '',
				taxRate: 0,
				quantity: 0,
				intent: invoiceServiceIntents.create,
			});
		});
		resetErrors();
	};

	const updateService = (service: SelectedInvoiceService) => {
		setInvoiceServices((prevServices) =>
			prevServices.map((prevService) => {
				if (prevService.invoiceServiceId === service.invoiceServiceId) {
					return service;
				}

				return prevService;
			}),
		);
		resetErrors();
	};

	const deleteService = (invoiceServiceId: string) => {
		setInvoiceServices((prevServices) =>
			prevServices.map((prevService) => {
				if (prevService.invoiceServiceId === invoiceServiceId) {
					return {
						...prevService,
						intent: invoiceServiceIntents.delete,
					};
				}

				return prevService;
			}),
		);
		resetErrors();
	};

	return (
		<div>
			<input type="hidden" name="subtotal-amount" value={subtotalAmount} />
			<input type="hidden" name="total-amount" value={totalAmount} />

			<div className="flex items-center justify-between">
				<h3>Services</h3>
				<Button onClick={addService}>Add new service</Button>
			</div>

			{errors?.['invoice-service'] ? (
				<div className="font-medium text-red-900">
					{errors['invoice-service']}
				</div>
			) : null}

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Service</TableHead>
						<TableHead>Rate</TableHead>
						<TableHead>Quantity</TableHead>
						<TableHead>Subtotal</TableHead>
						<TableHead>Tax</TableHead>
						<TableHead>Total</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{invoiceServices.map((invoiceService, index) => (
						<InvoiceServiceRow
							key={invoiceService.invoiceServiceId}
							invoiceService={invoiceService}
							services={services}
							taxes={taxes}
							index={index}
							updateService={updateService}
							deleteService={() =>
								deleteService(invoiceService.invoiceServiceId)
							}
							errors={errors}
						/>
					))}
				</TableBody>
			</Table>
			<div>
				<div className="flex items-center justify-between">
					<p>Sub-Total</p>
					<p>{subtotalAmount}</p>
				</div>
				<div className="flex items-center justify-between">
					<p>Total</p>
					<p>{totalAmount}</p>
				</div>
			</div>
		</div>
	);
}
