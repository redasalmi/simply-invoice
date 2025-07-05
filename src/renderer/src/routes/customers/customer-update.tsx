import { useRef } from "react";
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
import { AddressFormFields } from "~/renderer/components/AddressFormFields";
import { RichTextEditor } from "~/renderer/components/rich-text/editor";
import { Button } from "~/renderer/components/ui/button";
import { FormField } from "~/renderer/components/ui/form-field";
import { useFormActionErrorFocus } from "~/renderer/hooks/useFormActionErrorFocus";
import type {
	UpdateAddressInput,
	UpdateCustomerWithAddressInput,
} from "~/types";

export async function customerUpdateLoader({ params }: LoaderFunctionArgs) {
	const customerId = params.customerId;
	invariant(customerId, "Customer ID is required");

	return {
		customer: await window.api.db.customers.getById(customerId),
	};
}

export async function customerUpdateAction({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);

	const customer = {
		customerId: data["customer.customerId"],
		name: data["customer.name"],
		email: data["customer.email"],
		additionalInformation: data["customer.additionalInformation"]
			? JSON.parse(data["customer.additionalInformation"].toString())
			: undefined,
	} as unknown as UpdateCustomerWithAddressInput;

	const address = {
		addressId: data["address.addressId"],
		address1: data["address.address1"],
		address2: data["address.address2"],
		city: data["address.city"],
		country: data["address.country"],
		province: data["address.province"],
		zip: data["address.zip"],
	} as unknown as UpdateAddressInput;

	const result = await window.api.db.customers.updateWithAddress(
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

export function CustomerUpdateRoute() {
	const formRef = useRef<HTMLFormElement>(null);
	const { customer } = useLoaderData<typeof customerUpdateLoader>();
	const actionData = useActionData<typeof customerUpdateAction>();
	useFormActionErrorFocus(formRef, actionData);

	const navigation = useNavigation();
	const isLoading = navigation.state !== "idle";
	const isSubmitting = navigation.state === "submitting";

	if (!customer) {
		return (
			<section>
				<div>
					<p className="m-12">
						Sorry, but no customer with this ID was found! Please click{" "}
						<Link to="/customers">here</Link> to navigate back to your customers
						list.
					</p>
				</div>
			</section>
		);
	}

	return (
		<section>
			<Form className="flex flex-col gap-4" method="post" ref={formRef}>
				<input
					name="customer.customerId"
					type="hidden"
					value={customer.customerId}
				/>

				<FormField errors={actionData?.errors?.customer?.nested?.name}>
					<FormField.Label>Name</FormField.Label>
					<FormField.Input
						defaultValue={customer.name}
						name="customer.name"
						type="text"
					/>
					<FormField.ErrorMessage />
				</FormField>

				<FormField errors={actionData?.errors?.customer?.nested?.email}>
					<FormField.Label>Email</FormField.Label>
					<FormField.Input
						defaultValue={customer.email}
						name="customer.email"
						type="text"
					/>
					<FormField.ErrorMessage />
				</FormField>

				<div className="flex flex-col gap-4">
					<h3 className="text-2xl">Address</h3>
					<AddressFormFields
						address={customer.address}
						className="flex flex-col gap-4"
						errors={actionData?.errors?.address}
					/>
				</div>

				<div>
					<div>
						<h3 className="text-2xl">Additional Information</h3>
						<p className="mb-2 block text-sm">
							Add additional information about the customer
						</p>
					</div>

					<div>
						<RichTextEditor
							defaultValue={customer.additionalInformation ?? undefined}
							name="customer.additionalInformation"
						/>
					</div>
				</div>

				<div>
					<Button disabled={isSubmitting} type="submit">
						{isLoading ? "Updating Customer..." : "Update Customer"}
					</Button>
				</div>
			</Form>
		</section>
	);
}
