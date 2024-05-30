import * as React from 'react';
import { ComboBox, type Option } from './ui/combobox';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table';
import type { Service } from '~/lib/types';
import { Input } from './ui/input';

type ServicesTablesProps = {
	services: Array<Option>;
};

type ServiceRowProps = {
	services: Array<Option>;
};

function ServiceRow({ services }: ServiceRowProps) {
	const [selectedService, setSelectedService] = React.useState<Service | null>(
		null,
	);
	const [quantity, setQuantity] = React.useState(0);

	const amount = selectedService ? selectedService.rate * quantity : null;

	const onServiceChange = (option: Option | null) => {
		setSelectedService(option);
		if (option && quantity < 1) {
			setQuantity(1);
		}
	};

	const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setQuantity(parseInt(event.target.value, 10));
	};

	return (
		<TableRow>
			<TableCell>
				<ComboBox
					options={services}
					input={{
						name: 'service-id',
						placeholder: 'Choose a Service',
					}}
					onChangeCallback={onServiceChange}
				/>
			</TableCell>
			<TableCell>
				<Input
					type="number"
					value={quantity}
					min={selectedService ? 1 : 0}
					onChange={handleQuantityChange}
				/>
			</TableCell>
			<TableCell>{amount}</TableCell>
		</TableRow>
	);
}

export function ServicesTable({ services }: ServicesTablesProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Service</TableHead>
					<TableHead>Quantity</TableHead>
					<TableHead>Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<ServiceRow services={services} />
			</TableBody>
		</Table>
	);
}
