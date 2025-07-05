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
	const formRef = useRef<HTMLFormElement>(null);
	const { company } = useLoaderData<typeof companyUpdateLoader>();
	const actionData = useActionData<typeof companyUpdateAction>();
	useFormActionErrorFocus(formRef, actionData);

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
			<Form className="flex flex-col gap-4" method="post" ref={formRef}>
				<input
					name="company.companyId"
					type="hidden"
					value={company.companyId}
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
					<AddressFormFields
						address={company.address}
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
