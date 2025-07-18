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
import * as Dialog from "~/renderer/components/ui/dialog";

export async function customerDeleteLoader({ params }: LoaderFunctionArgs) {
	const customerId = params.customerId;
	invariant(customerId, "Customer ID is required");

	return {
		customer: await window.api.db.customers.getById(customerId),
	};
}

export async function customerDeleteAction({ params }: ActionFunctionArgs) {
	const customerId = params.customerId;
	invariant(customerId, "Customer ID is required");
	const result = await window.api.db.customers.delete(customerId);

	if ("errors" in result) {
		return {
			errors: result.errors,
		};
	}

	return redirect("/customers");
}

export function CustomerDeleteRoute() {
	const navigate = useNavigate();
	const params = useParams();
	const { customer } = useLoaderData<typeof customerDeleteLoader>();
	const actionData = useActionData<typeof customerDeleteAction>();

	const navigation = useNavigation();
	const isLoading = navigation.state !== "idle";
	const isSubmitting = navigation.state === "submitting";

	const closeAlert = () => {
		navigate("/customers");
	};

	if (!customer) {
		return (
			<Dialog.Root closeDialog={closeAlert} open role="alertdialog">
				<Dialog.Title>No Customer Found!</Dialog.Title>
				<Dialog.Description>
					Sorry but no customer with the ID: {params.customerId} was not found.
					Click the continue button to navigate back to your customers list.
				</Dialog.Description>
				<Dialog.ActionButton autoFocus onClick={closeAlert}>
					Continue
				</Dialog.ActionButton>
			</Dialog.Root>
		);
	}

	if (actionData?.errors) {
		return (
			<Dialog.Root closeDialog={closeAlert} open role="alertdialog">
				<Dialog.Title>Error Deleting Customer!</Dialog.Title>
				<Dialog.Description>
					An error happened while deleting your customer, please try again
					later.
				</Dialog.Description>
				<Dialog.ActionButton autoFocus onClick={closeAlert}>
					Continue
				</Dialog.ActionButton>
			</Dialog.Root>
		);
	}

	return (
		<Dialog.Root closeDialog={closeAlert} open role="alertdialog">
			<Dialog.Title>Are you absolutely sure?</Dialog.Title>
			<Dialog.Description>
				This action cannot be undone. This will permanently delete the{" "}
				{customer.name} customer.
			</Dialog.Description>
			<div className="flex justify-end gap-2">
				<Dialog.CancelButton autoFocus onClick={closeAlert}>
					Cancel
				</Dialog.CancelButton>
				<Form method="POST">
					<Dialog.ActionButton disabled={isSubmitting} type="submit">
						{isLoading ? "...Deleting" : "Delete"}
					</Dialog.ActionButton>
				</Form>
			</div>
		</Dialog.Root>
	);
}
