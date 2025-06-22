import { Button } from "@renderer/components/ui/button";
import { FormField } from "@renderer/components/ui/form-field";
import type { UpdateTax } from "@types";
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

export async function taxUpdateLoader({ params }: LoaderFunctionArgs) {
	const taxId = params.taxId;
	invariant(taxId, "Tax ID is required");

	return {
		tax: await window.api.db.taxes.getOne(taxId),
	};
}

export async function taxUpdateAction({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const tax = Object.fromEntries(formData) as unknown as UpdateTax;
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
							to="/taxes"
							aria-label="taxes list"
							className="hover:underline"
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
			<Form method="post" className="flex flex-col gap-4">
				<input type="hidden" name="taxId" value={tax.taxId} />

				<FormField errors={actionData?.errors?.nested?.name}>
					<FormField.Label>Name</FormField.Label>
					<FormField.Input type="text" name="name" defaultValue={tax.name} />
					<FormField.ErrorMessage />
				</FormField>

				<FormField errors={actionData?.errors?.nested?.description}>
					<FormField.Label>Description</FormField.Label>
					<FormField.Input
						type="text"
						name="description"
						defaultValue={tax.description ?? ""}
					/>
					<FormField.ErrorMessage />
				</FormField>

				<FormField errors={actionData?.errors?.nested?.rate}>
					<FormField.Label>Rate (%)</FormField.Label>
					<FormField.NumberInput name="rate" defaultValue={tax.rate} />
					<FormField.ErrorMessage />
				</FormField>

				<Button disabled={isSubmitting} type="submit">
					{isLoading ? "Updating Tax..." : "Update Tax"}
				</Button>
			</Form>
		</section>
	);
}
