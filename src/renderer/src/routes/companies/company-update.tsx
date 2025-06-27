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
	UpdateCompanyWithAddressInput,
} from "~/types";

export async function companyUpdateLoader({ params }: LoaderFunctionArgs) {
	const companyId = params.companyId;
	invariant(companyId, "Company ID is required");

	return {
		company: await window.api.db.companies.getById(companyId),
	};
}

export async function companyUpdateAction({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);

	const company = {
		companyId: data["company.companyId"],
		name: data["company.name"],
		email: data["company.email"],
		additionalInformation: data["company.additionalInformation"]
			? JSON.parse(data["company.additionalInformation"].toString())
			: undefined,
	} as unknown as UpdateCompanyWithAddressInput;

	const address = {
		addressId: data["address.addressId"],
		address1: data["address.address1"],
		address2: data["address.address2"],
		city: data["address.city"],
		country: data["address.country"],
		province: data["address.province"],
		zip: data["address.zip"],
	} as unknown as UpdateAddressInput;

	const result = await window.api.db.companies.updateWithAddress(
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

export function CompanyUpdateRoute() {
	const { company } = useLoaderData<typeof companyUpdateLoader>();
	const actionData = useActionData<typeof companyUpdateAction>();

	const navigation = useNavigation();
	const isLoading = navigation.state !== "idle";
	const isSubmitting = navigation.state === "submitting";

	if (!company) {
		return (
			<section>
				<div>
					<p className="m-12">
						Sorry, but no company with this ID was found! Please click{" "}
						<Link to="/companies">here</Link> to navigate back to your companies
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
					name="company.companyId"
					type="hidden"
					value={company.companyId}
				/>
				<input
					name="address.addressId"
					type="hidden"
					value={company.addressId}
				/>

				<FormField errors={actionData?.errors?.company?.nested?.name}>
					<FormField.Label>Name</FormField.Label>
					<FormField.Input
						defaultValue={company.name}
						name="company.name"
						type="text"
					/>
					<FormField.ErrorMessage />
				</FormField>

				<FormField errors={actionData?.errors?.company?.nested?.email}>
					<FormField.Label>Email</FormField.Label>
					<FormField.Input
						defaultValue={company.email}
						name="company.email"
						type="text"
					/>
					<FormField.ErrorMessage />
				</FormField>

				<div className="flex flex-col gap-4">
					<h3 className="text-2xl">Address</h3>

					<FormField errors={actionData?.errors?.address?.nested?.address1}>
						<FormField.Label>Address 1</FormField.Label>
						<FormField.Input
							defaultValue={company.address.address1}
							name="address.address1"
							type="text"
						/>
						<FormField.ErrorMessage />
					</FormField>

					<FormField errors={actionData?.errors?.address?.nested?.address2}>
						<FormField.Label>Address 2</FormField.Label>
						<FormField.Input
							defaultValue={company.address.address2 ?? ""}
							name="address.address2"
							type="text"
						/>
						<FormField.ErrorMessage />
					</FormField>

					<FormField errors={actionData?.errors?.address?.nested?.city}>
						<FormField.Label>City</FormField.Label>
						<FormField.Input
							defaultValue={company.address.city}
							name="address.city"
							type="text"
						/>
						<FormField.ErrorMessage />
					</FormField>

					<FormField errors={actionData?.errors?.address?.nested?.country}>
						<FormField.Label>Country</FormField.Label>
						<FormField.Input
							defaultValue={company.address.country}
							name="address.country"
							type="text"
						/>
						<FormField.ErrorMessage />
					</FormField>

					<FormField errors={actionData?.errors?.address?.nested?.province}>
						<FormField.Label>Province</FormField.Label>
						<FormField.Input
							defaultValue={company.address.province ?? ""}
							name="address.province"
							type="text"
						/>
						<FormField.ErrorMessage />
					</FormField>

					<FormField errors={actionData?.errors?.address?.nested?.zip}>
						<FormField.Label>Zip</FormField.Label>
						<FormField.Input
							defaultValue={company.address.zip}
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
							Add additional information about the company
						</p>
					</div>

					<div>
						<RichTextEditor
							defaultValue={company.additionalInformation ?? undefined}
							name="company.additionalInformation"
						/>
					</div>
				</div>

				<div>
					<Button disabled={isSubmitting} type="submit">
						{isLoading ? "Updating Company..." : "Update Company"}
					</Button>
				</div>
			</Form>
		</section>
	);
}
