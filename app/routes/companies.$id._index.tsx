import {
	type ClientLoaderFunctionArgs,
	useLoaderData,
	useNavigate,
} from '@remix-run/react';
import invariant from 'tiny-invariant';
import { EntityDetail } from '~/components/Entity/detail';
import { EntityNotFound } from '~/components/Entity/error';
import { Dialog, DialogContent } from '~/components/ui/dialog';
import { db } from '~/lib/db';

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
	invariant(params.id, 'Company ID is required');
	const companyId = params.id;

	return {
		company: await db.companies.get(companyId),
	};
}

export default function CompanyRoute() {
	const { company } = useLoaderData<typeof clientLoader>();
	const navigate = useNavigate();

	const closeDialog = () => {
		navigate('/companies');
	};

	return (
		<Dialog open closeDialog={closeDialog}>
			<DialogContent>
				{!company ? (
					<EntityNotFound type="company" baseUrl="/companies" />
				) : (
					<EntityDetail entity={company} />
				)}
			</DialogContent>
		</Dialog>
	);
}
