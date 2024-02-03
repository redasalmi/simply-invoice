import { Link, useLoaderData } from '@remix-run/react';
import localforage from 'localforage';

import {
	buttonVariants,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui';
import { companiesKey } from '~/constants';
import { cn } from '~/lib/utils';

import type { Company } from '~/types';

export async function clientLoader() {
	return {
		companies: await localforage.getItem<Array<Company>>(companiesKey),
	};
}

export default function CompaniesRoute() {
	const { companies } = useLoaderData<typeof clientLoader>();

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
			<div className="mt-6">
				{companies && companies.length > 0 ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Email</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{companies.map(({ id, email, name }) => (
								<TableRow key={id}>
									<TableCell>{name}</TableCell>
									<TableCell>{email}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<p>No Company found.</p>
				)}
			</div>
		</section>
	);
}
