import { Link, useNavigate } from 'react-router';
import {
	DialogClose,
	DialogPopup,
	DialogOverlay,
	DialogPortal,
	DialogRoot,
	DialogTitle,
} from '~/components/ui/dialog';
import { Table, TableBody, TableCell, TableRow } from '~/components/ui/table';
import { getTax } from '~/routes/taxes/queries/tax.queries';
import type { Route } from './+types/tax-detail';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const taxId = params.id;

	return {
		tax: await getTax(taxId),
	};
}

export default function TaxDetailRoute({ loaderData }: Route.ComponentProps) {
	const navigate = useNavigate();

	const tax = loaderData?.tax;

	const closeDialog = () => {
		navigate('/taxes');
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Escape') {
			closeDialog();
		}
	};

	return (
		<DialogRoot open>
			<DialogPortal>
				<DialogOverlay />
				<DialogPopup onKeyDown={handleKeyDown}>
					{!tax ? (
						<>
							<DialogTitle>No tax found!</DialogTitle>
							<p className="m-12">
								Sorry, but no tax with this ID was found! Please click{' '}
								<Link
									to="/taxes"
									aria-label="taxes list"
									className="hover:underline"
								>
									Here
								</Link>{' '}
								to navigate back to your taxes list.
							</p>
						</>
					) : (
						<>
							<DialogTitle>Tax details</DialogTitle>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell>Name:</TableCell>
										<TableCell>{tax.name}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Rate:</TableCell>
										<TableCell>{tax.rate}%</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</>
					)}

					<DialogClose onClick={closeDialog} />
				</DialogPopup>
			</DialogPortal>
		</DialogRoot>
	);
}
