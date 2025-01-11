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

type PartialService = Pick<Service, 'serviceId' | 'name' | 'rate'>;
type PartialTax = Pick<Tax, 'taxId' | 'name' | 'rate'>;

type ServiceRowProps = {
	id: string;
	services: Array<PartialService>;
	taxes: Array<PartialTax>;
	updateService: (service: {
		id: string;
		serviceRate: number;
		taxRate: number;
		quantity: number;
	}) => void;
	deleteService: () => void;
	errors?: Record<string, [string, ...string[]] | undefined>;
};

export function ServiceRow({
	id,
	services,
	taxes,
	updateService,
	deleteService,
	errors,
}: ServiceRowProps) {
	const [serviceRate, setServiceRate] = React.useState(0);
	const [quantity, setQuantity] = React.useState(0);
	const [taxRate, setTaxRate] = React.useState(0);

	const subtotalAmount = serviceRate * quantity;
	const totalAmount = subtotalAmount + (subtotalAmount * taxRate) / 100;

	const onServiceChange = (service: ComboboxItem<PartialService> | null) => {
		const newServiceRate = service?.rate || 0;

		setServiceRate(newServiceRate);
		if (!newServiceRate) {
			setQuantity(0);
		}

		updateService({
			id,
			quantity,
			serviceRate: newServiceRate,
			taxRate,
		});
	};

	const onQuantityChange = (value: number | null) => {
		const newQuantity = value || 0;
		setQuantity(newQuantity);
		updateService({
			id,
			quantity: newQuantity,
			serviceRate,
			taxRate,
		});
	};

	const onTaxChange = (tax: ComboboxItem<PartialTax> | null) => {
		const newTaxRate = tax?.rate || 0;
		setTaxRate(newTaxRate);
		updateService({
			id,
			quantity,
			serviceRate,
			taxRate: newTaxRate,
		});
	};

	return (
		<TableRow>
			<TableCell className="hidden">
				<input
					type="hidden"
					name={`service-invoice-service-id-${id}`}
					value={id}
				/>
			</TableCell>

			<TableCell>
				<Combobox
					hideLabel
					name={`service-service-id-${id}`}
					label="Service"
					placeholder="Select a service"
					itemIdKey="serviceId"
					items={services}
					onChange={onServiceChange}
					errorMessage={errors?.[`service-service-id-${id}`]?.[0]}
				/>
			</TableCell>

			<TableCell>{serviceRate}</TableCell>

			<TableCell>
				<FieldRoot name={`service-quantity-${id}`} className="my-2">
					{/* TODO: improve this when a new version is released or some examples are available */}
					<FieldLabel className="sr-only">Quantity</FieldLabel>
					<NumberFieldRoot
						value={quantity}
						name={`service-quantity-${id}`}
						onValueChange={onQuantityChange}
					>
						<NumberFieldGroup>
							<NumberFieldDecrement />
							<NumberFieldInput name={`service-quantity-${id}`} />
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
					name={`service-tax-id-${id}`}
					label="Tax"
					placeholder="Select a tax"
					itemIdKey="taxId"
					items={taxes}
					renderItemName={(item) => `${item.name} (${item.rate}%)`}
					onChange={onTaxChange}
					errorMessage={errors?.[`service-tax-id-${id}`]?.[0]}
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
