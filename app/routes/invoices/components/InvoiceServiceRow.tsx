import * as React from 'react';
import { TrashIcon } from 'lucide-react';
import { TableCell, TableRow } from '~/components/ui/table';
import { Button } from '~/components/ui/button';
import { Combobox, type ComboboxItem } from '~/components/ui/combobox';
import { FieldError, FieldLabel, FieldRoot } from '~/components/ui/field';
import {
	NumberFieldDecrement,
	NumberFieldGroup,
	NumberFieldIncrement,
	NumberFieldInput,
	NumberFieldRoot,
} from '~/components/ui/number-field';
import type { Service, Tax } from '~/types';
import {
	invoiceServiceIntents,
	type SelectedInvoiceService,
} from './InvoiceServicesTable';
import { cn } from '~/utils/shared.utils';

type PartialService = Pick<Service, 'serviceId' | 'name' | 'rate'>;
type PartialTax = Pick<Tax, 'taxId' | 'name' | 'rate'>;

type ServiceRowProps = {
	invoiceService: SelectedInvoiceService;
	services: Array<PartialService>;
	taxes: Array<PartialTax>;
	index: number;
	updateService: (service: SelectedInvoiceService) => void;
	deleteService: () => void;
	errors?: Record<string, [string, ...string[]] | undefined>;
};

export function InvoiceServiceRow({
	invoiceService,
	services,
	taxes,
	index,
	updateService,
	deleteService,
	errors,
}: ServiceRowProps) {
	const { invoiceServiceId, intent } = invoiceService;

	const [serviceRate, setServiceRate] = React.useState(
		invoiceService.serviceRate,
	);
	const [quantity, setQuantity] = React.useState(invoiceService.quantity);
	const [taxRate, setTaxRate] = React.useState(invoiceService.taxRate);

	const subtotalAmount = serviceRate * quantity;
	const totalAmount = subtotalAmount + (subtotalAmount * taxRate) / 100;

	const onServiceChange = (service: ComboboxItem<PartialService> | null) => {
		if (!service) {
			setServiceRate(0);
			setQuantity(0);

			updateService({
				invoiceServiceId,
				quantity,
				serviceId: '',
				serviceRate: 0,
				taxId: invoiceService.taxId,
				taxRate,
				intent,
			});

			return;
		}

		const newRate = service.rate;
		setServiceRate(newRate);
		updateService({
			invoiceServiceId,
			quantity,
			serviceId: service.serviceId,
			serviceRate: newRate,
			taxId: invoiceService.taxId,
			taxRate,
			intent,
		});
	};

	const onQuantityChange = (value: number | null) => {
		const newQuantity = value || 0;
		setQuantity(newQuantity);
		updateService({
			invoiceServiceId,
			quantity: newQuantity,
			serviceId: invoiceService.serviceId,
			serviceRate,
			taxId: invoiceService.taxId,
			taxRate,
			intent,
		});
	};

	const onTaxChange = (tax: ComboboxItem<PartialTax> | null) => {
		if (!tax) {
			setTaxRate(0);
			updateService({
				invoiceServiceId,
				quantity,
				serviceId: invoiceService.serviceId,
				serviceRate,
				taxId: '',
				taxRate: 0,
				intent,
			});

			return;
		}

		const newTaxRate = tax.rate;
		setTaxRate(newTaxRate);
		updateService({
			invoiceServiceId,
			quantity,
			serviceId: invoiceService.serviceId,
			serviceRate,
			taxId: tax.taxId,
			taxRate: newTaxRate,
			intent,
		});
	};

	return (
		<TableRow
			className={cn(
				invoiceService.intent === invoiceServiceIntents.delete && 'hidden',
			)}
		>
			<TableCell className="hidden">
				<input
					type="hidden"
					name={`invoice-service.${index}.invoice-service-id`}
					value={invoiceServiceId}
				/>
				<input
					type="hidden"
					name={`invoice-service.${index}.intent`}
					value={intent}
				/>
			</TableCell>

			<TableCell>
				<Combobox
					hideLabel
					name={`invoice-service.${index}.service-id`}
					label="Service"
					defaultValue={invoiceService.serviceId}
					placeholder="Select a service"
					itemIdKey="serviceId"
					items={services}
					onChange={onServiceChange}
					errorMessage={errors?.[`invoice-service.${index}.service-id`]?.[0]}
				/>
			</TableCell>

			<TableCell>{serviceRate}</TableCell>

			<TableCell>
				<FieldRoot name={`invoice-service.${index}.quantity`} className="my-2">
					{/* TODO: improve this when a new version is released or some examples are available */}
					<FieldLabel className="sr-only">Quantity</FieldLabel>
					<NumberFieldRoot
						value={quantity}
						name={`invoice-service.${index}.quantity]`}
						onValueChange={onQuantityChange}
					>
						<NumberFieldGroup>
							<NumberFieldDecrement />
							<NumberFieldInput name={`invoice-service.${index}.quantity`} />
							<NumberFieldIncrement />
						</NumberFieldGroup>
					</NumberFieldRoot>
					<FieldError />
				</FieldRoot>
			</TableCell>

			<TableCell>{subtotalAmount}</TableCell>

			<TableCell>
				<Combobox
					hideLabel
					name={`invoice-service.${index}.tax-id`}
					label="Tax"
					defaultValue={invoiceService.taxId}
					placeholder="Select a tax"
					itemIdKey="taxId"
					items={taxes}
					renderItemName={(item) => `${item.name} (${item.rate}%)`}
					onChange={onTaxChange}
					errorMessage={errors?.[`invoice-service.${index}.tax-id`]?.[0]}
				/>
			</TableCell>

			<TableCell>{totalAmount}</TableCell>

			<TableCell>
				<Button
					variant="icon"
					aria-label="delete service"
					onClick={deleteService}
				>
					<TrashIcon />
				</Button>
			</TableCell>
		</TableRow>
	);
}
