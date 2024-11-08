import { useNavigate } from 'react-router';
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
import { getCompany } from '~/queries/company.queries';
import type * as Route from './+types.company-detail';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const companyId = params.id;
	return {
		company: await getCompany(companyId),
	};
}

export default function CompanyDetailRoute({
	loaderData,
}: Route.ComponentProps) {
	const navigate = useNavigate();

	const company = loaderData?.company;

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
