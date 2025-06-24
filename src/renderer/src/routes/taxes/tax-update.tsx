import {
	type ActionFunctionArgs,
	Form,
	Link,
	type LoaderFunctionArgs,
	redirect,
	useActionData,
	useLoaderData,
	useNavigation,
} from "react-router";
import invariant from "tiny-invariant";
import { Button } from "~/renderer/components/ui/button";
import { FormField } from "~/renderer/components/ui/form-field";
import type { UpdateTaxInput } from "~/types";

export async function taxUpdateLoader({ params }: LoaderFunctionArgs) {
	const taxId = params.taxId;
	invariant(taxId, "Tax ID is required");

	return {
		tax: await window.api.db.taxes.getById(taxId),
	};
}

export async function taxUpdateAction({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const tax = Object.fromEntries(formData) as unknown as UpdateTaxInput;
	const result = await window.api.db.taxes.update(tax);

	if ("errors" in result) {
		return {
			errors: result.errors,
		};
	}

	return redirect("/taxes");
}

export function TaxUpdateRoute() {
	const { tax } = useLoaderData<typeof taxUpdateLoader>();
	const actionData = useActionData<typeof taxUpdateAction>();

	const navigation = useNavigation();
	const isLoading = navigation.state !== "idle";
	const isSubmitting = navigation.state === "submitting";

	if (!tax) {
		return (
			<section>
				<div>
					<p className="m-12">
						Sorry, but no tax with this ID was found! Please click{" "}
						<Link
							aria-label="taxes list"
							className="hover:underline"
							to="/taxes"
						>
							Here
						</Link>{" "}
						to navigate back to your taxes list.
					</p>
				</div>
			</section>
		);
	}

	return (
		<section>
			<Form className="flex flex-col gap-4" method="post">
				<input name="taxId" type="hidden" value={tax.taxId} />

				<FormField errors={actionData?.errors?.nested?.name}>
					<FormField.Label>Name</FormField.Label>
					<FormField.Input defaultValue={tax.name} name="name" type="text" />
					<FormField.ErrorMessage />
				</FormField>

				<FormField errors={actionData?.errors?.nested?.description}>
					<FormField.Label>Description</FormField.Label>
					<FormField.Input
						defaultValue={tax.description ?? ""}
						name="description"
						type="text"
					/>
					<FormField.ErrorMessage />
				</FormField>

				<FormField errors={actionData?.errors?.nested?.rate}>
					<FormField.Label>Rate (%)</FormField.Label>
					<FormField.NumberInput defaultValue={tax.rate} name="rate" />
					<FormField.ErrorMessage />
				</FormField>

				<Button disabled={isSubmitting} type="submit">
					{isLoading ? "Updating Tax..." : "Update Tax"}
				</Button>
			</Form>
		</section>
	);
}
