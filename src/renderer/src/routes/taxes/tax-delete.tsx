import { Dialog } from "@renderer/components/ui/dialog";
import {
	type ActionFunctionArgs,
	Form,
	type LoaderFunctionArgs,
	redirect,
	useActionData,
	useLoaderData,
	useNavigate,
	useNavigation,
	useParams,
} from "react-router";
import invariant from "tiny-invariant";

export async function taxDeleteLoader({ params }: LoaderFunctionArgs) {
	const taxId = params.taxId;
	invariant(taxId, "Tax ID is required");

	return {
		tax: await window.api.db.taxes.getById(taxId),
	};
}

export async function taxDeleteAction({ params }: ActionFunctionArgs) {
	const taxId = params.taxId;
	invariant(taxId, "Tax ID is required");
	const result = await window.api.db.taxes.delete(taxId);

	if ("errors" in result) {
		return {
			errors: result.errors,
		};
	}

	return redirect("/taxes");
}

export function TaxDeleteRoute() {
	const navigate = useNavigate();
	const params = useParams();
	const { tax } = useLoaderData<typeof taxDeleteLoader>();
	const actionData = useActionData<typeof taxDeleteAction>();

	const navigation = useNavigation();
	const isLoading = navigation.state !== "idle";
	const isSubmitting = navigation.state === "submitting";

	const closeAlert = () => {
		navigate("/taxes");
	};

	if (!tax) {
		return (
			<Dialog open role="alertdialog">
				<Dialog.Title>No Tax Found!</Dialog.Title>
				<Dialog.Description>
					Sorry but no tax with this ID: {params.taxId} was found. Click the
					continue button to navigate back to your taxes list.
				</Dialog.Description>
				<Dialog.ActionButton onClick={closeAlert}>Continue</Dialog.ActionButton>
			</Dialog>
		);
	}

	if (actionData?.errors) {
		return (
			<Dialog open role="alertdialog">
				<Dialog.Title>Error Deleting Tax!</Dialog.Title>
				<Dialog.Description>
					An error happened while deleting your tax, please try again later.
				</Dialog.Description>
				<Dialog.ActionButton onClick={closeAlert}>Continue</Dialog.ActionButton>
			</Dialog>
		);
	}

	return (
		<Dialog open role="alertdialog">
			<Dialog.Title>Are you absolutely sure?</Dialog.Title>
			<Dialog.Description>
				This action cannot be undone. This will permanently delete the{" "}
				{tax.name} tax.
			</Dialog.Description>
			<div className="flex justify-end gap-2">
				<Dialog.CancelButton onClick={closeAlert}>Cancel</Dialog.CancelButton>
				<Form method="POST">
					<Dialog.ActionButton type="submit" disabled={isSubmitting}>
						{isLoading ? "...Deleting" : "Delete"}
					</Dialog.ActionButton>
				</Form>
			</div>
		</Dialog>
	);
}
