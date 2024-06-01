import { Link } from '@remix-run/react';
import type { EntityType } from '~/types/entity.types';

type EntityNotFoundProps = {
	type: EntityType;
	baseUrl: string;
};

export function EntityNotFound({ type, baseUrl }: EntityNotFoundProps) {
	const entityName = type === 'company' ? 'companies' : 'customers';

	return (
		<p className="m-12">
			Sorry, but no {type} with this ID was found! Please click{' '}
			<Link
				to={baseUrl}
				className="hover:underline"
				aria-label={`${entityName} list`}
			>
				Here
			</Link>{' '}
			to navigate back to your {entityName} list.
		</p>
	);
}
