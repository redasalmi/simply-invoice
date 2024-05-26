import { For, Match, Show, Switch, createResource } from 'solid-js';
import { A } from '@solidjs/router';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/Table';
import { db, getPage } from '~/lib/db';

export default function Companies() {
	const [companies] = createResource(async () => getPage(db.companies, 1), {
		ssrLoadFrom: 'initial',
	});

	return (
		<section>
			<div class="flex justify-end">
				<A href="/companies/new" class="rounded-lg bg-blue-300 px-4 py-2">
					Create New Company
				</A>
			</div>

			<Show when={companies.loading}>
				<p>loading companies...</p>
			</Show>

			<Switch>
				<Match when={companies.error}>
					<span>Error: {companies.error()}</span>
				</Match>

				<Match when={!companies()?.items.length}>
					<p>No Company found.</p>
				</Match>

				<Match when={companies()?.items.length}>
					<div>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Email</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<For each={companies()?.items}>
									{(company) => (
										<TableRow>
											<TableCell>{company.name}</TableCell>
											<TableCell>{company.email}</TableCell>
											<TableCell class="flex items-center gap-4">
												<A
													href={`/companies/${company.id}`}
													aria-label={`view ${company.name} company details`}
												>
													eye icon
												</A>
												<A
													href={`/companies/${company.id}/update`}
													aria-label={`update ${company.name} company`}
												>
													pencil icon
												</A>
												<A
													href={`/companies/${company.id}/delete`}
													aria-label={`delete ${company.name} company`}
												>
													trash icon
												</A>
											</TableCell>
										</TableRow>
									)}
								</For>
							</TableBody>
						</Table>
					</div>
				</Match>
			</Switch>
		</section>
	);
}
