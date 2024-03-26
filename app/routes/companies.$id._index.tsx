import {
	type ClientLoaderFunctionArgs,
	Link,
	useLoaderData,
	useNavigate,
} from '@remix-run/react';
import invariant from 'tiny-invariant';
import { Dialog, DialogContent } from '~/components/ui/dialog';
import { Table, TableBody, TableCell, TableRow } from '~/components/ui/table';
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
		<Dialog open onOpenChange={closeDialog}>
			<DialogContent className="h-full max-h-[80%] max-w-[80%]">
				{!company ? (
					<div>
						<p className="m-12">
							Sorry, but no company with this ID was found! Please click{' '}
							<Link
								to="/companies"
								aria-label="companies list"
								className="hover:underline"
							>
								Here
							</Link>{' '}
							to navigate back to your companies list.
						</p>
					</div>
				) : (
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

						{company.custom?.length ? (
							<div>
								<p>Custom Fields:</p>
								<Table>
									<TableBody>
										{company.custom.map((field) => (
											<TableRow key={field.id}>
												<TableCell>{field.label}:</TableCell>
												<TableCell>{field.content}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						) : null}
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
