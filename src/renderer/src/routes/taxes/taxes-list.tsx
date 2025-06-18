import { CreateLink } from "@renderer/components/CreateLink";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@renderer/components/ui/table";
import { getPaginationParams } from "@renderer/utils/getPaginationParams";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import {
	Link,
	type LoaderFunctionArgs,
	Outlet,
	useLoaderData,
} from "react-router";
// import { Pagination } from '~/components/Pagination';
// import { getPaginationParams, itemsPerPage } from '~/lib/pagination';
// import type { Route } from './+types/taxes-list';

export async function taxesLoader({ request }: LoaderFunctionArgs) {
	const { cursor, paginationType } = getPaginationParams(request.url);

	return {
		taxes: await window.api.db.taxes.get(cursor, paginationType),
	};
}

export function TaxesListRoute() {
	const { taxes } = useLoaderData<typeof taxesLoader>();

	return (
		<>
			<section>
				<div className="flex items-center justify-between">
					{taxes.total ? <p>Total taxes: {taxes.total}</p> : null}
					<CreateLink to="/taxes/create">Create Tax</CreateLink>
				</div>
				<div className="mt-6">
					{taxes && taxes.items.length > 0 ? (
						<>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Rate (%)</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{taxes.items.map(({ taxId, name, rate }) => (
										<TableRow key={taxId}>
											<TableCell>{name}</TableCell>
											<TableCell>{rate}</TableCell>
											<TableCell className="flex items-center gap-4">
												<Link
													to={`/taxes/detail/${taxId}`}
													aria-label={`view ${name} tax details`}
												>
													<EyeIcon />
												</Link>
												<Link
													to={`/taxes/update/${taxId}`}
													aria-label={`update ${name} tax`}
												>
													<PencilIcon />
												</Link>
												<Link
													to={`/taxes/delete/${taxId}`}
													aria-label={`delete ${name} tax`}
												>
													<TrashIcon />
												</Link>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							{/* {taxes.total > itemsPerPage ? (
								<Pagination baseUrl="/taxes" pageInfo={taxes.pageInfo} />
							) : null} */}
						</>
					) : (
						<p>No Tax found.</p>
					)}
				</div>
			</section>
			<Outlet />
		</>
	);
}
