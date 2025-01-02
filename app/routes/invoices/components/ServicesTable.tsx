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
import { ServiceRow } from './ServiceRow';
import type { Service, Tax } from '~/types';

type ServicesTablesProps = {
	services: Array<Pick<Service, 'serviceId' | 'name' | 'rate'>>;
	taxes: Array<Pick<Tax, 'taxId' | 'name' | 'rate'>>;
};

export type SelectedService = {
	id: string;
	serviceRate: number;
	taxRate: number;
	quantity: number;
};

export function ServicesTable({ services, taxes }: ServicesTablesProps) {
	const [servicesList, setServicesList] = React.useState<
		Array<SelectedService>
	>([
		{
			id: ulid(),
			serviceRate: 0,
			taxRate: 0,
			quantity: 0,
		},
	]);

	const subtotalAmount = servicesList.reduce(
		(acc, { quantity, serviceRate }) => acc + quantity * serviceRate,
		0,
	);

	const totalAmount = servicesList.reduce(
		(acc, { quantity, serviceRate, taxRate }) => {
			const subtotal = quantity * serviceRate;

			return acc + subtotal + (subtotal * taxRate) / 100;
		},
		0,
	);

	const addService = () => {
		setServicesList((prevServices) => {
			return prevServices.concat({
				id: ulid(),
				serviceRate: 0,
				taxRate: 0,
				quantity: 0,
			});
		});
	};

	const updateService = (service: SelectedService) => {
		setServicesList((prevServices) =>
			prevServices.map((prevService) => {
				if (prevService.id === service.id) {
					return service;
				}

				return prevService;
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
						<TableHead>Rate</TableHead>
						<TableHead>Quantity</TableHead>
						<TableHead>Subtotal</TableHead>
						<TableHead>Tax</TableHead>
						<TableHead>Total</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{servicesList.map(({ id }) => (
						<ServiceRow
							key={id}
							id={id}
							services={services}
							taxes={taxes}
							updateService={updateService}
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
				<div className="flex items-center justify-between">
					<p>Total</p>
					<p>{totalAmount}</p>
				</div>
			</div>
		</div>
	);
}
