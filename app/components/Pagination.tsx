import { Form, useNavigation } from 'react-router';
import { Button } from '~/components/ui/button';
import {
	cursorParam,
	paginationTypeParam,
	paginationTypes,
} from '~/lib/pagination';
import type { PageInfo } from '~/types';

type PaginationProps = {
	baseUrl: string;
	pageInfo: PageInfo;
};

export function Pagination({ baseUrl, pageInfo }: PaginationProps) {
	const navigation = useNavigation();
	const isSubmitting = navigation.state !== 'idle';

	return (
		<div className="mt-8 flex items-center justify-end gap-4">
			<Form method="get" action={baseUrl}>
				<input type="hidden" name={cursorParam} value={pageInfo.startCursor} />
				<input
					type="hidden"
					name={paginationTypeParam}
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
				<input type="hidden" name={cursorParam} value={pageInfo.endCursor} />
				<input
					type="hidden"
					name={paginationTypeParam}
					value={paginationTypes.next}
				/>
				<Button type="submit" disabled={isSubmitting || !pageInfo.hasNextPage}>
					Next
				</Button>
			</Form>
		</div>
	);
}
