import { Button } from "@renderer/components/ui/button";
import { FormField } from "@renderer/components/ui/form-field";
import type { CreateTaxInput } from "@types";
import {
	type ActionFunctionArgs,
	Form,
	redirect,
	useActionData,
	useNavigation,
} from "react-router";

export async function taxCreateAction({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const tax = Object.fromEntries(formData) as unknown as CreateTaxInput;
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
				<FormField errors={actionData?.errors?.nested?.name}>
					<FormField.Label>Name</FormField.Label>
					<FormField.Input type="text" name="name" />
					<FormField.ErrorMessage />
				</FormField>

				<FormField errors={actionData?.errors?.nested?.description}>
					<FormField.Label>Description</FormField.Label>
					<FormField.Input type="text" name="description" />
					<FormField.ErrorMessage />
				</FormField>

				<FormField errors={actionData?.errors?.nested?.rate}>
					<FormField.Label>Rate (%)</FormField.Label>
					<FormField.NumberInput name="rate" />
					<FormField.ErrorMessage />
				</FormField>

				<Button type="submit" disabled={isSubmitting}>
					{isLoading ? "Saving Tax..." : "Save Tax"}
				</Button>
			</Form>
		</section>
	);
}
