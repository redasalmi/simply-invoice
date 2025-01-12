import { useNavigate } from 'react-router';
import {
	DialogClose,
	DialogPopup,
	DialogOverlay,
	DialogPortal,
	DialogRoot,
	DialogTitle,
} from '~/components/ui/dialog';
import { getCompany } from '~/routes/companies/queries/company.queries';
import { Table, TableBody, TableCell, TableRow } from '~/components/ui/table';
import { CompanyNotFound } from '~/routes/companies/components/CompanyNotFound';
import type { Route } from './+types/company-detail';

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

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Escape') {
			closeDialog();
		}
	};

	return (
		<DialogRoot open>
			<DialogPortal>
				<DialogOverlay />
				<DialogPopup onKeyDown={handleKeyDown}>
					<DialogTitle>
						{!company ? 'No company found!' : 'Company Details'}
					</DialogTitle>

					{!company ? (
						<CompanyNotFound />
					) : (
						<div>
							<div>
								<Table>
									<TableBody>
										<TableRow>
											<TableCell>Name:</TableCell>
											<TableCell>{company.name}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Email:</TableCell>
											<TableCell>{company.email}</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</div>

							<div>
								<p>Address:</p>
								<Table>
									<TableBody>
										<TableRow>
											<TableCell>Address 1:</TableCell>
											<TableCell>{company.address.address1}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Address 2:</TableCell>
											<TableCell>{company.address.address2}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Country:</TableCell>
											<TableCell>{company.address.country}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Province:</TableCell>
											<TableCell>{company.address.province}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>City:</TableCell>
											<TableCell>{company.address.city}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Zip:</TableCell>
											<TableCell>{company.address.zip}</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</div>
						</div>
					)}

					<DialogClose onClick={closeDialog} />
				</DialogPopup>
			</DialogPortal>
		</DialogRoot>
	);
}
