import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { Eye, Pencil, Trash } from 'lucide-react';

import {
	buttonVariants,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui';

import { db, getPage } from '~/lib/stores';
import { cn } from '~/lib/utils';

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
					className={cn(
						'rounded-lg bg-blue-300 px-4 py-2',
						buttonVariants({ variant: 'default' }),
					)}
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
						className={cn(
							'rounded-lg bg-blue-300 px-4 py-2',
							buttonVariants({ variant: 'default' }),
						)}
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
