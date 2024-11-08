import { Link } from 'react-router';
import { EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table';
import { capitalize } from '~/utils/shared.utils';
import type { Entity, EntityType } from '~/types/entity.types';
import type { PaginatedResult } from '~/types/shared.types';

type EntitiesListProps = {
	type: EntityType;
	baseUrl: string;
	entities?: PaginatedResult<Entity>;
	entityIdKey: string;
};

export function EntitiesList({
	type,
	baseUrl,
	entities,
	entityIdKey,
}: EntitiesListProps) {
	if (!entities || !entities.items.length) {
		return <p>No {capitalize(type)} found.</p>;
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{entities.items.map(({ email, name, ...item }) => (
					<TableRow key={item[entityIdKey]}>
						<TableCell>{name}</TableCell>
						<TableCell>{email}</TableCell>
						<TableCell className="flex items-center gap-4">
							<Link
								to={`${baseUrl}/detail/${item[entityIdKey]}`}
								aria-label={`view ${name} ${type} details`}
							>
								<EyeIcon />
							</Link>
							<Link
								to={`${baseUrl}/update/${item[entityIdKey]}`}
								aria-label={`update ${name} ${type}`}
							>
								<PencilIcon />
							</Link>
							<Link
								to={`${baseUrl}/delete/${item[entityIdKey]}/`}
								aria-label={`delete ${name} ${type}`}
							>
								<TrashIcon />
							</Link>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
