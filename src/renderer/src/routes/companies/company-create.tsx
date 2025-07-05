import { useRef } from "react";
import {
	type ActionFunctionArgs,
	Form,
	redirect,
	useActionData,
	useNavigation,
} from "react-router";
import { AddressFormFields } from "~/renderer/components/AddressFormFields";
import { RichTextEditor } from "~/renderer/components/rich-text/editor";
import { Button } from "~/renderer/components/ui/button";
import { FormField } from "~/renderer/components/ui/form-field";
import { useFormActionErrorFocus } from "~/renderer/hooks/useFormActionErrorFocus";
import type {
	CreateAddressInput,
	CreateCompanyWithAddressInput,
} from "~/types";

export async function companyCreateAction({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);

	const company = {
		name: data["company.name"],
		email: data["company.email"],
		additionalInformation: data["company.additionalInformation"]
			? JSON.parse(data["company.additionalInformation"].toString())
			: undefined,
	} as unknown as CreateCompanyWithAddressInput;

	const address = {
		address1: data["address.address1"],
		address2: data["address.address2"],
		city: data["address.city"],
		country: data["address.country"],
		province: data["address.province"],
		zip: data["address.zip"],
	} as unknown as CreateAddressInput;

	const result = await window.api.db.companies.createWithAddress(
		company,
		address,
	);

	if ("errors" in result) {
		return {
			errors: result.errors,
		};
	}

	return redirect("/companies");
}

export function CompanyCreateRoute() {
	const formRef = useRef<HTMLFormElement>(null);
	const actionData = useActionData<typeof companyCreateAction>();
	useFormActionErrorFocus(formRef, actionData);

	const navigation = useNavigation();
	const isLoading = navigation.state !== "idle";
	const isSubmitting = navigation.state === "submitting";

	return (
		<section>
			<Form className="flex flex-col gap-4" method="post" ref={formRef}>
				<FormField errors={actionData?.errors?.company?.nested?.name}>
					<FormField.Label>Name</FormField.Label>
					<FormField.Input name="company.name" type="text" />
					<FormField.ErrorMessage />
				</FormField>

				<FormField errors={actionData?.errors?.company?.nested?.email}>
					<FormField.Label>Email</FormField.Label>
					<FormField.Input name="company.email" type="text" />
					<FormField.ErrorMessage />
				</FormField>

				<div className="flex flex-col gap-4">
					<h3 className="text-2xl">Address</h3>
					<AddressFormFields
						className="flex flex-col gap-4"
						errors={actionData?.errors?.address}
					/>
				</div>

				<div>
					<div>
						<h3 className="text-2xl">Additional Information</h3>
						<p className="mb-2 block text-sm">
							Add additional information about the company
						</p>
					</div>

					<div>
						<RichTextEditor name="company.additionalInformation" />
					</div>
				</div>

				<div>
					<Button disabled={isSubmitting} type="submit">
						{isLoading ? "Saving Company..." : "Save Company"}
					</Button>
				</div>
			</Form>
		</section>
	);
}
