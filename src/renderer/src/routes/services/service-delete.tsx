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
import { Dialog } from "~/renderer/components/ui/dialog";

export async function serviceDeleteLoader({ params }: LoaderFunctionArgs) {
	const serviceId = params.serviceId;
	invariant(serviceId, "Service ID is required");

	return {
		service: await window.api.db.services.getById(serviceId),
	};
}

export async function serviceDeleteAction({ params }: ActionFunctionArgs) {
	const serviceId = params.serviceId;
	invariant(serviceId, "Service ID is required");
	const result = await window.api.db.services.delete(serviceId);

	if ("errors" in result) {
		return {
			errors: result.errors,
		};
	}

	return redirect("/services");
}

export function ServiceDeleteRoute() {
	const navigate = useNavigate();
	const params = useParams();
	const { service } = useLoaderData<typeof serviceDeleteLoader>();
	const actionData = useActionData<typeof serviceDeleteAction>();

	const navigation = useNavigation();
	const isLoading = navigation.state !== "idle";
	const isSubmitting = navigation.state === "submitting";

	const closeAlert = () => {
		navigate("/services");
	};

	if (!service) {
		return (
			<Dialog closeDialog={closeAlert} open role="alertdialog">
				<Dialog.Title>No service found!</Dialog.Title>
				<Dialog.Description>
					Sorry, but no service with the ID: {params.serviceId} was found. Click
					the continue button to navigate back to your services list.
				</Dialog.Description>
				<Dialog.ActionButton autoFocus onClick={closeAlert}>
					Continue
				</Dialog.ActionButton>
			</Dialog>
		);
	}

	if (actionData?.errors) {
		return (
			<Dialog closeDialog={closeAlert} open role="alertdialog">
				<Dialog.Title>Error Deleting Service!</Dialog.Title>
				<Dialog.Description>
					An error happened while deleting your service, please try again later.
				</Dialog.Description>
				<Dialog.ActionButton autoFocus onClick={closeAlert}>
					Continue
				</Dialog.ActionButton>
			</Dialog>
		);
	}

	return (
		<Dialog closeDialog={closeAlert} open>
			<Dialog.Title>Are you absolutely sure?</Dialog.Title>
			<Dialog.Description>
				This action cannot be undone. This will permanently delete the{" "}
				{service.name} service.
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
		</Dialog>
	);
}
