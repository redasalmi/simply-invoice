import { Form, useNavigation } from 'react-router';
import { Button } from '~/components/ui/button';
import { paginationTypes } from '~/lib/pagination';
import type { PageInfo } from '~/types';

type PaginationProps = {
	total: number;
	totalLabel: string;
	baseUrl: string;
	pageInfo: PageInfo;
};

export function Pagination({
	totalLabel,
	total,
	baseUrl,
	pageInfo,
}: PaginationProps) {
	const navigation = useNavigation();
	const isSubmitting = navigation.state !== 'idle';

	return (
		<div className="mt-8 flex items-center justify-between">
			<div>
				<p>
					{totalLabel} {total}
				</p>
			</div>
			<div className="flex justify-end gap-4">
				<Form method="get" action={baseUrl}>
					<input type="hidden" name="cursor" value={pageInfo.startCursor} />
					<input
						type="hidden"
						name="pagination-type"
						value={paginationTypes.previous}
					/>
					<Button
						type="submit"
						disabled={isSubmitting || !pageInfo.hasPreviousPage}
					>
						Previous
					</Button>
				</Form>
				<Form method="get" action={baseUrl}>
					<input type="hidden" name="cursor" value={pageInfo.endCursor} />
					<input
						type="hidden"
						name="pagination-type"
						value={paginationTypes.next}
					/>
					<Button
						type="submit"
						disabled={isSubmitting || !pageInfo.hasNextPage}
					>
						Next
					</Button>
				</Form>
			</div>
		</div>
	);
}
