import { Button } from "@renderer/components/ui/button";
import { FormField } from "@renderer/components/ui/form-field";
import type { InsertTax } from "@types";
import {
	type ActionFunctionArgs,
	Form,
	redirect,
	useActionData,
	useNavigation,
} from "react-router";

export async function taxCreateAction({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const tax = Object.fromEntries(formData) as unknown as InsertTax;
	const result = await window.api.db.taxes.create(tax);

	if ("errors" in result) {
		return {
			errors: result.errors,
		};
	}

	return redirect("/taxes");
}

export function TaxCreateRoute() {
	const actionData = useActionData<typeof taxCreateAction>();

	const navigation = useNavigation();
	const isLoading = navigation.state !== "idle";
	const isSubmitting = navigation.state === "submitting";

	return (
		<section>
			<Form method="post" className="flex flex-col gap-4">
				<FormField>
					<FormField.Label>Name</FormField.Label>
					<FormField.Input type="text" name="name" />
					{actionData?.errors?.nested?.name?.length ? (
						<FormField.ErrorMessage>
							{actionData.errors.nested.name[0]}
						</FormField.ErrorMessage>
					) : null}
				</FormField>

				<FormField>
					<FormField.Label>Description</FormField.Label>
					<FormField.Input type="text" name="description" />
					{actionData?.errors?.nested?.description?.length ? (
						<FormField.ErrorMessage>
							{actionData.errors.nested.description[0]}
						</FormField.ErrorMessage>
					) : null}
				</FormField>

				<FormField>
					<FormField.Label>Rate (%)</FormField.Label>
					<FormField.NumberInput name="rate" />
					{actionData?.errors?.nested?.rate?.length ? (
						<FormField.ErrorMessage>
							{actionData.errors.nested.rate[0]}
						</FormField.ErrorMessage>
					) : null}
				</FormField>

				<Button type="submit" disabled={isSubmitting || isLoading}>
					{isSubmitting ? "Saving Tax..." : "Save Tax"}
				</Button>
			</Form>
		</section>
	);
}
