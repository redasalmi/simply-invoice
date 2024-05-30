import { Link } from '@remix-run/react';
import { Eye, Pencil, Trash } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table';
import { capitalize } from '~/utils/shared';
import type { Entity, EntityType, PaginatedResult } from '~/lib/types';

type EntitiesListProps = {
	baseUrl: string;
	type: EntityType;
	entities: PaginatedResult<Entity>;
};

export function EntitiesList({ baseUrl, type, entities }: EntitiesListProps) {
	return entities && entities.items.length > 0 ? (
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
								<Eye />
							</Link>
							<Link
								to={`${baseUrl}/${id}/update`}
								aria-label={`update ${name} ${type}`}
							>
								<Pencil />
							</Link>
							<Link
								to={`${baseUrl}/${id}/delete`}
								aria-label={`delete ${name} ${type}`}
							>
								<Trash />
							</Link>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	) : (
		<p>No {capitalize(type)} found.</p>
	);
}
