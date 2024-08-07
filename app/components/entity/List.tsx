import { Link } from '@remix-run/react';
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
	entities: PaginatedResult<Entity>;
};

export function EntitiesList({ type, baseUrl, entities }: EntitiesListProps) {
	if (!entities.items.length) {
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
				{entities.items.map(({ id, email, name }) => (
					<TableRow key={id}>
						<TableCell>{name}</TableCell>
						<TableCell>{email}</TableCell>
						<TableCell className="flex items-center gap-4">
							<Link
								to={`${baseUrl}/${id}`}
								aria-label={`view ${name} ${type} details`}
							>
								<EyeIcon />
							</Link>
							<Link
								to={`${baseUrl}/${id}/update`}
								aria-label={`update ${name} ${type}`}
							>
								<PencilIcon />
							</Link>
							<Link
								to={`${baseUrl}/${id}/delete`}
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
