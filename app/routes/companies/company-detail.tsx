import { useNavigate } from 'react-router';
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
import type { Route } from './+types/company-detail';
import CompanyDetail from '~/components/company/CompanyDetail';

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
					<DialogTitle>
						{!company ? 'No company found!' : 'Company Details'}
					</DialogTitle>

					<CompanyDetail company={company} />

					<DialogClose asChild onClick={closeDialog}>
						<DialogCloseButton />
					</DialogClose>
				</DialogContent>
			</DialogPortal>
		</DialogRoot>
	);
}
