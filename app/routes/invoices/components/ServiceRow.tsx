import * as React from 'react';
import { TrashIcon } from 'lucide-react';
import { TableCell, TableRow } from '~/components/ui/table';
import { Button } from '~/components/ui/button';
import { Combobox, type ComboboxItem } from '~/components/ui/combobox';
import type { Service, Tax } from '~/types';
import { FieldError, FieldRoot } from '~/components/ui/field';
import {
	NumberFieldDecrement,
	NumberFieldGroup,
	NumberFieldIncrement,
	NumberFieldInput,
	NumberFieldLabel,
	NumberFieldRoot,
} from '~/components/ui/number-field';

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
};

export function ServiceRow({
	id,
	services,
	taxes,
	updateService,
	deleteService,
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
			<TableCell>
				<Combobox
					hideLabel
					name={`service-service-id-${id}`}
					label="Service"
					placeholder="Select a service"
					itemIdKey="serviceId"
					items={services}
					onChange={onServiceChange}
				/>
			</TableCell>

			<TableCell>{serviceRate}</TableCell>

			<TableCell>
				<FieldRoot name={`service-quantity-${id}`} className="my-2">
					{/* NumberField is not integrated very well with the Form component for now, 
            that's why it's wrapper with a FieldRoot, look into this when a new version is released  
          */}
					<NumberFieldRoot
						id={`service-quantity-${id}`}
						name={`service-quantity-${id}`}
						value={quantity}
						onValueChange={onQuantityChange}
					>
						<NumberFieldLabel htmlFor="rate" className="sr-only">
							Quantity
						</NumberFieldLabel>
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
					onChange={onTaxChange}
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
