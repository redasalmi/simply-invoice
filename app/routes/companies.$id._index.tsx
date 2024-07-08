import {
	type ClientLoaderFunctionArgs,
	useLoaderData,
	useNavigate,
} from '@remix-run/react';
import invariant from 'tiny-invariant';
import { EntityDetail } from '~/components/entity/Detail';
import { EntityNotFound } from '~/components/entity/Error';
import {
	DialogClose,
	DialogCloseButton,
	DialogContent,
	DialogOverlay,
	DialogPortal,
	DialogRoot,
	DialogTitle,
} from '~/components/ui/dialog';
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
		<DialogRoot open>
			<DialogPortal>
				<DialogOverlay />
				<DialogContent onEscapeKeyDown={closeDialog}>
					{!company ? (
						<>
							<DialogTitle>No company found!</DialogTitle>
							<EntityNotFound type="company" baseUrl="/companies" />
						</>
					) : (
						<>
							<DialogTitle>Company Details</DialogTitle>
							<EntityDetail entity={company} />
						</>
					)}

					<DialogClose asChild onClick={closeDialog}>
						<DialogCloseButton />
					</DialogClose>
				</DialogContent>
			</DialogPortal>
		</DialogRoot>
	);
}
