import * as React from 'react';
import { ulid } from 'ulid';
import { TrashIcon } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table';
import { FormField } from '~/components/FormField';
import { Button } from '~/components/ui/button';
import { Combobox } from '~/components/ui/combobox';
import type { Service } from '~/types/service.types';

type ServicesTablesProps = {
	services: Array<Service>;
};

type ServiceRowProps = {
	id: string;
	services: Array<Service>;
	updateServiceAmount: (id: string, amount: number) => void;
	deleteService: () => void;
};

function ServiceRow({
	id,
	services,
	updateServiceAmount,
	deleteService,
}: ServiceRowProps) {
	const [selectedService, setSelectedService] = React.useState<Service | null>(
		null,
	);
	const [quantity, setQuantity] = React.useState(0);

	const servicesList = React.useMemo(() => {
		return services.map(({ id, name }) => ({ id, name, value: id }));
	}, [services]);

	const amount = React.useMemo(() => {
		return selectedService?.rate ? selectedService.rate * quantity : 0;
	}, [quantity, selectedService?.rate]);

	const onServiceChange = (optionId?: string) => {
		if (!optionId) {
			setSelectedService(null);
			setQuantity(0);

			return;
		}

		const option = services.find(({ id }) => id === optionId);
		if (!option) {
			return;
		}

		setSelectedService(option);

		let newQuantity = quantity;
		if (!option) {
			newQuantity = 0;
		} else if (option && quantity < 1) {
			newQuantity = 1;
		}

		setQuantity(newQuantity);
		updateServiceAmount(id, option?.rate ? option.rate * newQuantity : 0);
	};

	const onQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newQuantity = parseInt(event.target.value, 10);
		setQuantity(newQuantity);
		updateServiceAmount(
			id,
			selectedService?.rate ? selectedService.rate * newQuantity : 0,
		);
	};

	return (
		<TableRow>
			<TableCell>
				<Combobox
					id={`service-id-${id}`}
					name={`service-id-${id}`}
					label="Service"
					placeholder="Select a service"
					listItems={servicesList}
					inputValueChangeCallback={onServiceChange}
				/>
			</TableCell>
			<TableCell>
				<FormField
					type="number"
					id={`service-quantity-${id}`}
					label="Quantity"
					name={`service-quantity-${id}`}
					value={quantity}
					min={selectedService ? 1 : 0}
					onInput={onQuantityChange}
				/>
			</TableCell>
			<TableCell>{amount}</TableCell>
			<TableCell>
				<Button variant="icon" onClick={deleteService}>
					<TrashIcon />
				</Button>
			</TableCell>
		</TableRow>
	);
}

export function ServicesTable({ services }: ServicesTablesProps) {
	const [servicesList, setServicesList] = React.useState<
		Array<{ id: string; amount: number }>
	>([
		{
			id: ulid(),
			amount: 0,
		},
	]);

	const [shipping, setShipping] = React.useState(0);
	const [tax, setTax] = React.useState(0);

	const subtotalAmount = React.useMemo(() => {
		return servicesList.reduce((acc, service) => acc + service.amount, 0);
	}, [servicesList]);

	const totalAmount = React.useMemo(() => {
		return subtotalAmount + shipping + subtotalAmount * (tax / 100);
	}, [subtotalAmount, shipping, tax]);

	const addService = () => {
		setServicesList((prevServices) => {
			return prevServices.concat({ id: ulid(), amount: 0 });
		});
	};

	const updateServiceAmount = (id: string, amount: number) => {
		setServicesList((prevServices) =>
			prevServices.map((service) => {
				if (service.id === id) {
					return {
						id,
						amount,
					};
				}

				return service;
			}),
		);
	};

	const deleteService = (id: string) => {
		setServicesList((prevServices) =>
			prevServices.filter((field) => field.id !== id),
		);
	};

	return (
		<div>
			<div className="flex items-center justify-between">
				<h3>Services</h3>
				<Button onClick={addService}>Add new service</Button>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Service</TableHead>
						<TableHead>Quantity</TableHead>
						<TableHead>Amount</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{servicesList.map(({ id }) => (
						<ServiceRow
							key={id}
							id={id}
							services={services}
							updateServiceAmount={updateServiceAmount}
							deleteService={() => deleteService(id)}
						/>
					))}
				</TableBody>
			</Table>
			<div>
				<div className="flex items-center justify-between">
					<p>Sub-Total</p>
					<p>{subtotalAmount}</p>
				</div>
				<FormField
					id="shipping"
					type="number"
					className="flex items-center gap-4"
					label="Shipping"
					name="shipping"
					min={0}
					required
					value={shipping}
					onInput={(event) =>
						setShipping(parseInt(event.currentTarget.value, 10))
					}
				/>
				<FormField
					id="tax"
					type="number"
					className="flex items-center gap-4"
					label="Tax (%)"
					name="tax"
					min={0}
					max={100}
					required
					value={tax}
					onInput={(event) => setTax(parseInt(event.currentTarget.value, 10))}
				/>
				<div className="flex items-center justify-between">
					<p>Total</p>
					<p>{totalAmount}</p>
				</div>
			</div>
		</div>
	);
}
