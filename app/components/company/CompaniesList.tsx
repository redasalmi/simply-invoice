import { Link } from 'react-router';
import { EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table';
import { Company, PaginatedResult } from '~/types';

type CompaniesListProps = {
	companies?: PaginatedResult<Company>;
};

export function CompaniesList({ companies }: CompaniesListProps) {
	if (!companies || !companies.items.length) {
		return <p>No companies found.</p>;
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
				{companies.items.map(({ companyId, email, name }) => (
					<TableRow key={companyId}>
						<TableCell>{name}</TableCell>
						<TableCell>{email}</TableCell>
						<TableCell className="flex items-center gap-4">
							<Link
								to={`/companies/detail/${companyId}`}
								aria-label={`view ${name} company details`}
							>
								<EyeIcon />
							</Link>
							<Link
								to={`/companies/update/${companyId}`}
								aria-label={`update ${name} company`}
							>
								<PencilIcon />
							</Link>
							<Link
								to={`/companies/delete/${companyId}/`}
								aria-label={`delete ${name} company`}
							>
								<TrashIcon />
							</Link>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
