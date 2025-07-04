import {
	type ActionFunctionArgs,
	Form,
	redirect,
	useActionData,
	useNavigation,
} from "react-router";
import { AddressForm } from "~/renderer/components/AddressForm";
import { RichTextEditor } from "~/renderer/components/rich-text/editor";
import { Button } from "~/renderer/components/ui/button";
import { FormField } from "~/renderer/components/ui/form-field";
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
		additionalInformation: data["customer.additionalInformation"]
			? JSON.parse(data["customer.additionalInformation"] as string)
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
	const actionData = useActionData<typeof customerCreateAction>();

	const navigation = useNavigation();
	const isLoading = navigation.state !== "idle";
	const isSubmitting = navigation.state === "submitting";

	return (
		<section>
			<Form className="flex flex-col gap-4" method="post">
				<FormField errors={actionData?.errors?.customer?.nested?.name}>
					<FormField.Label>Name</FormField.Label>
					<FormField.Input name="customer.name" type="text" />
					<FormField.ErrorMessage />
				</FormField>

				<FormField errors={actionData?.errors?.customer?.nested?.email}>
					<FormField.Label>Email</FormField.Label>
					<FormField.Input name="customer.email" type="text" />
					<FormField.ErrorMessage />
				</FormField>

				<div className="flex flex-col gap-4">
					<h3 className="text-2xl">Address</h3>
					<AddressForm errors={actionData?.errors?.address} />

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
