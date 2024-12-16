import { Table, TableBody, TableCell, TableRow } from '~/components/ui/table';
import { CompanyNotFound } from '~/components/company/CompanyNotFound';
import type { Company } from '~/types';

type CompanyDetailProps = {
	company?: Company;
};

export default function CompanyDetail({ company }: CompanyDetailProps) {
	if (!company) {
		return <CompanyNotFound />;
	}

	return (
		<>
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

			{company.customFields?.length ? (
				<div>
					<p>Custom Fields:</p>
					<Table>
						<TableBody>
							{company.customFields.map(
								({ companyCustomFieldId, label, content }) => (
									<TableRow key={companyCustomFieldId}>
										<TableCell>{label}:</TableCell>
										<TableCell>{content}</TableCell>
									</TableRow>
								),
							)}
						</TableBody>
					</Table>
				</div>
			) : null}
		</>
	);
}
