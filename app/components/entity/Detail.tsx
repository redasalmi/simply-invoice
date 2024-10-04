import { Table, TableBody, TableCell, TableRow } from '~/components/ui/table';
import type { Entity } from '~/types/entity.types';

type EntityDetailProps = {
	entity: Entity;
};

export function EntityDetail({ entity }: EntityDetailProps) {
	return (
		<>
			<div>
				<Table>
					<TableBody>
						<TableRow>
							<TableCell>Name:</TableCell>
							<TableCell>{entity.name}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Email:</TableCell>
							<TableCell>{entity.email}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>

			<div>
				<p>Address:</p>
				<Table>
					<TableBody>
						<TableRow>
							<TableCell>Address 1:</TableCell>
							<TableCell>{entity.address.address1}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Address 2:</TableCell>
							<TableCell>{entity.address.address2}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Country:</TableCell>
							<TableCell>{entity.address.country}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Province:</TableCell>
							<TableCell>{entity.address.province}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>City:</TableCell>
							<TableCell>{entity.address.city}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Zip:</TableCell>
							<TableCell>{entity.address.zip}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>

			{entity.custom?.length ? (
				<div>
					<p>Custom Fields:</p>
					<Table>
						<TableBody>
							{entity.custom.map(({ id, label, content }) => (
								<TableRow key={id}>
									<TableCell>{label}:</TableCell>
									<TableCell>{content}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			) : null}
		</>
	);
}
