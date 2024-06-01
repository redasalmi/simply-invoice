import * as React from 'react';
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
import type { Entity, EntityType } from '~/types/entity.types';
import type { PaginatedResult } from '~/types/common.types';

type CreateEntityLinkProps = {
	pathname: string;
	children: React.ReactNode;
};

export function CreateEntityLink({
	pathname,
	children,
}: CreateEntityLinkProps) {
	return (
		<Link to={pathname} className={'rounded-lg bg-blue-300 px-4 py-2'}>
			{children}
		</Link>
	);
}

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
	);
}
