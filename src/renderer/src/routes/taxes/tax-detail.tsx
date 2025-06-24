import {
	Link,
	type LoaderFunctionArgs,
	useLoaderData,
	useNavigate,
} from "react-router";
import invariant from "tiny-invariant";
import { Dialog } from "~/renderer/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "~/renderer/components/ui/table";

export async function taxDetailLoader({ params }: LoaderFunctionArgs) {
	const taxId = params.taxId;
	invariant(taxId, "Tax ID is required");

	return {
		tax: await window.api.db.taxes.getById(taxId),
	};
}

export function TaxDetailRoute() {
	const navigate = useNavigate();
	const { tax } = useLoaderData<typeof taxDetailLoader>();

	const closeDialog = () => {
		navigate("/taxes");
	};

	return (
		<Dialog closeDialog={closeDialog} open>
			<Dialog.CloseButton autoFocus onClick={closeDialog} />

			{!tax ? (
				<>
					<Dialog.Title>No tax found!</Dialog.Title>
					<Dialog.Description>
						<p>
							Sorry, but no tax with this ID was found! Please click{" "}
							<Link
								aria-label="taxes list"
								className="hover:underline"
								to="/taxes"
							>
								Here
							</Link>
						</p>
					</Dialog.Description>
				</>
			) : (
				<>
					<Dialog.Title>Tax details</Dialog.Title>
					<Dialog.Description>
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
					</Dialog.Description>
				</>
			)}
		</Dialog>
	);
}
