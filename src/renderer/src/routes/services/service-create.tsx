import { useRef } from "react";
import {
	type ActionFunctionArgs,
	Form,
	redirect,
	useActionData,
	useNavigation,
} from "react-router";
import { Button } from "~/renderer/components/ui/button";
import { FormField } from "~/renderer/components/ui/form-field";
import { Select } from "~/renderer/components/ui/select";
import { useFormActionErrorFocus } from "~/renderer/hooks/useFormActionErrorFocus";
import { statusOptions } from "~/renderer/utils/constants";
import type { CreateServiceInput } from "~/types";

export async function serviceCreateAction({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const service = Object.fromEntries(formData) as unknown as CreateServiceInput;
	const result = await window.api.db.services.create(service);

	if ("errors" in result) {
		return {
			errors: result.errors,
		};
	}

	return redirect("/services");
}

export function ServiceCreateRoute() {
	const formRef = useRef<HTMLFormElement>(null);
	const actionData = useActionData<typeof serviceCreateAction>();
	useFormActionErrorFocus(formRef, actionData);

	const navigation = useNavigation();
	const isLoading = navigation.state !== "idle";
	const isSubmitting = navigation.state === "submitting";

	return (
		<section>
			<Form className="flex flex-col gap-4" method="post" ref={formRef}>
				<FormField errors={actionData?.errors?.nested?.name}>
					<FormField.Label>Name</FormField.Label>
					<FormField.Input name="name" type="text" />
					<FormField.ErrorMessage />
				</FormField>

				<FormField errors={actionData?.errors?.nested?.description}>
					<FormField.Label>Description</FormField.Label>
					<FormField.Input name="description" type="text" />
					<FormField.ErrorMessage />
				</FormField>

				<FormField errors={actionData?.errors?.nested?.rate}>
					<FormField.Label>Rate(%)</FormField.Label>
					<FormField.NumberInput name="rate" />
					<FormField.ErrorMessage />
				</FormField>

				<Select
					defaultSelectedItem={statusOptions[0]}
					errors={actionData?.errors?.nested?.status}
					items={statusOptions}
					label="Status"
					name="status"
				/>

				<Button disabled={isSubmitting} type="submit">
					{isLoading ? "Saving Service..." : "Save Service"}
				</Button>
			</Form>
		</section>
	);
}
