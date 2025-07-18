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
import * as FormField from "~/renderer/components/ui/form-field";
import { Select } from "~/renderer/components/ui/select";
import { useFormActionErrorFocus } from "~/renderer/hooks/useFormActionErrorFocus";
import { statusOptions } from "~/renderer/utils/constants";
import type {
	CreateAddressInput,
	CreateCustomerWithAddressInput,
} from "~/types";

export async function customerCreateAction({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);

	const customer = {
		name: data["customer.name"],
		email: data["customer.email"],
		phone: data["customer.phone"],
		taxId: data["customer.taxId"],
		status: data["customer.status"],
		additionalInformation: data["customer.additionalInformation"]
			? JSON.parse(data["customer.additionalInformation"].toString())
			: undefined,
	} as unknown as CreateCustomerWithAddressInput;

	const address = {
		address1: data["address.address1"],
		address2: data["address.address2"],
		city: data["address.city"],
		country: data["address.country"],
		province: data["address.province"],
		zip: data["address.zip"],
	} as unknown as CreateAddressInput;

	const result = await window.api.db.customers.createWithAddress(
		customer,
		address,
	);

	if ("errors" in result) {
		return {
			errors: result.errors,
		};
	}

	return redirect("/customers");
}

export function CustomerCreateRoute() {
	const formRef = useRef<HTMLFormElement>(null);
	const actionData = useActionData<typeof customerCreateAction>();
	useFormActionErrorFocus(formRef, actionData);

	const navigation = useNavigation();
	const isLoading = navigation.state !== "idle";
	const isSubmitting = navigation.state === "submitting";

	return (
		<section>
			<Form className="flex flex-col gap-4" method="post" ref={formRef}>
				<FormField.Root errors={actionData?.errors?.customer?.nested?.name}>
					<FormField.Label>Name</FormField.Label>
					<FormField.Input name="customer.name" type="text" />
					<FormField.ErrorMessage />
				</FormField.Root>

				<FormField.Root errors={actionData?.errors?.customer?.nested?.email}>
					<FormField.Label>Email</FormField.Label>
					<FormField.Input name="customer.email" type="text" />
					<FormField.ErrorMessage />
				</FormField.Root>

				<FormField.Root errors={actionData?.errors?.customer?.nested?.phone}>
					<FormField.Label>Phone</FormField.Label>
					<FormField.Input name="customer.phone" type="text" />
					<FormField.ErrorMessage />
				</FormField.Root>

				<FormField.Root errors={actionData?.errors?.customer?.nested?.taxId}>
					<FormField.Label>Tax ID</FormField.Label>
					<FormField.Input name="customer.taxId" type="text" />
					<FormField.ErrorMessage />
				</FormField.Root>

				<Select
					defaultSelectedItem={statusOptions[0]}
					errors={actionData?.errors?.customer?.nested?.status}
					items={statusOptions}
					label="Status"
					name="customer.status"
				/>

				<div className="flex flex-col gap-4">
					<h3 className="text-2xl">Address</h3>
					<AddressFormFields
						className="flex flex-col gap-4"
						errors={actionData?.errors?.address}
					/>

					<div>
						<div>
							<h3 className="text-2xl">Additional Information</h3>
							<p className="mb-2 block text-sm">
								Add additional information about the customer
							</p>
						</div>

						<div>
							<RichTextEditor name="customer.additionalInformation" />
						</div>
					</div>
				</div>

				<div>
					<Button disabled={isSubmitting} type="submit">
						{isLoading ? "Saving Customer..." : "Save Customer"}
					</Button>
				</div>
			</Form>
		</section>
	);
}
