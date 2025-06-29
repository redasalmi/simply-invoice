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

export async function companyDetailLoader({ params }: LoaderFunctionArgs) {
	const companyId = params.companyId;
	invariant(companyId, "Company ID is required");

	return {
		company: await window.api.db.companies.getById(companyId),
	};
}

export function CompanyDetailRoute() {
	const navigate = useNavigate();
	const { company } = useLoaderData<typeof companyDetailLoader>();

	const closeDialog = () => {
		navigate("/companies");
	};

	return (
		<Dialog closeDialog={closeDialog} open>
			<Dialog.CloseButton autoFocus onClick={closeDialog} />

			{!company ? (
				<>
					<Dialog.Title>No company found!</Dialog.Title>
					<Dialog.Description>
						<p>
							Sorry, but no company with this ID was found! Please click{" "}
							<Link
								aria-label="companies list"
								className="hover:underline"
								to="/companies"
							>
								Here
							</Link>
						</p>
					</Dialog.Description>
				</>
			) : (
				<>
					<Dialog.Title>Company details</Dialog.Title>
					<Dialog.Description>
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
								<TableRow>
									<TableCell>Address 1:</TableCell>
									<TableCell>{company.address.address1}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Address 2:</TableCell>
									<TableCell>{company.address.address2}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>City:</TableCell>
									<TableCell>{company.address.city}</TableCell>
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
									<TableCell>Zip:</TableCell>
									<TableCell>{company.address.zip}</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</Dialog.Description>
				</>
			)}
		</Dialog>
	);
}
