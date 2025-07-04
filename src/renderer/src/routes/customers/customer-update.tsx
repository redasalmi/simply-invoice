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
import { RichTextEditor } from "~/renderer/components/rich-text/editor";
import { Button } from "~/renderer/components/ui/button";
import { FormField } from "~/renderer/components/ui/form-field";
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
	const { customer } = useLoaderData<typeof customerUpdateLoader>();
	const actionData = useActionData<typeof customerUpdateAction>();

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
			<Form className="flex flex-col gap-4" method="post">
				<input
					name="customer.customerId"
					type="hidden"
					value={customer.customerId}
				/>
				<input
					name="address.addressId"
					type="hidden"
					value={customer.addressId}
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

					<FormField errors={actionData?.errors?.address?.nested?.address1}>
						<FormField.Label>Address 1</FormField.Label>
						<FormField.Input
							defaultValue={customer.address.address1}
							name="address.address1"
							type="text"
						/>
						<FormField.ErrorMessage />
					</FormField>

					<FormField errors={actionData?.errors?.address?.nested?.address2}>
						<FormField.Label>Address 2</FormField.Label>
						<FormField.Input
							defaultValue={customer.address.address2 ?? ""}
							name="address.address2"
							type="text"
						/>
						<FormField.ErrorMessage />
					</FormField>

					<FormField errors={actionData?.errors?.address?.nested?.city}>
						<FormField.Label>City</FormField.Label>
						<FormField.Input
							defaultValue={customer.address.city}
							name="address.city"
							type="text"
						/>
						<FormField.ErrorMessage />
					</FormField>

					<FormField errors={actionData?.errors?.address?.nested?.country}>
						<FormField.Label>Country</FormField.Label>
						<FormField.Input
							defaultValue={customer.address.country}
							name="address.country"
							type="text"
						/>
						<FormField.ErrorMessage />
					</FormField>

					<FormField errors={actionData?.errors?.address?.nested?.province}>
						<FormField.Label>Province</FormField.Label>
						<FormField.Input
							defaultValue={customer.address.province ?? ""}
							name="address.province"
							type="text"
						/>
						<FormField.ErrorMessage />
					</FormField>

					<FormField errors={actionData?.errors?.address?.nested?.zip}>
						<FormField.Label>Zip</FormField.Label>
						<FormField.Input
							defaultValue={customer.address.zip}
							name="address.zip"
							type="text"
						/>
						<FormField.ErrorMessage />
					</FormField>
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
