import {
	type ClientLoaderFunctionArgs,
	useLoaderData,
	useNavigate,
} from '@remix-run/react';
import { Heading } from 'react-aria-components';
import invariant from 'tiny-invariant';
import { EntityDetail } from '~/components/entity/Detail';
import { EntityNotFound } from '~/components/entity/Error';
import { Modal } from '~/components/react-aria/modal';
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
		<Modal isOpen closeDialog={closeDialog}>
			{!company ? (
				<>
					<Heading slot="title">No company found!</Heading>
					<EntityNotFound type="company" baseUrl="/companies" />
				</>
			) : (
				<>
					<Heading slot="title">Company Details</Heading>
					<EntityDetail entity={company} />
				</>
			)}
		</Modal>
	);
}
