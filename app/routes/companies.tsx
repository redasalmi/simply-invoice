import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { Eye, Pencil, Trash } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table';
import { db, getPage } from '~/lib/db';

export async function clientLoader() {
	return {
		companies: await getPage(db.companies, 1),
	};
}

export function HydrateFallback() {
	return (
		<section>
			<div className="flex justify-end">
				<Link
					to="/companies/new"
					className={'rounded-lg bg-blue-300 px-4 py-2'}
				>
					Create New Company
				</Link>
			</div>
		</section>
	);
}

export default function CompaniesRoute() {
	const { companies } = useLoaderData<typeof clientLoader>();

	return (
		<>
			<section>
				<div className="flex justify-end">
					<Link
						to="/companies/new"
						className={'rounded-lg bg-blue-300 px-4 py-2'}
					>
						Create New Company
					</Link>
				</div>
				<div className="mt-6">
					{companies && companies.items.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Email</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{companies.items.map(({ id, email, name }) => (
									<TableRow key={id}>
										<TableCell>{name}</TableCell>
										<TableCell>{email}</TableCell>
										<TableCell className="flex items-center gap-4">
											<Link
												to={`/companies/${id}`}
												aria-label={`view ${name} company details`}
											>
												<Eye />
											</Link>
											<Link
												to={`/companies/${id}/update`}
												aria-label={`update ${name} company`}
											>
												<Pencil />
											</Link>
											<Link
												to={`/companies/${id}/delete`}
												aria-label={`delete ${name} company`}
											>
												<Trash />
											</Link>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<p>No Company found.</p>
					)}
				</div>
			</section>
			<Outlet />
		</>
	);
}
