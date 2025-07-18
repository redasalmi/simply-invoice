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
import { Button } from "~/renderer/components/ui/button";
import * as FormField from "~/renderer/components/ui/form-field";
import { Select } from "~/renderer/components/ui/select";
import { useFormActionErrorFocus } from "~/renderer/hooks/useFormActionErrorFocus";
import { statusOptions } from "~/renderer/utils/constants";
import type { UpdateServiceInput } from "~/types";

export async function serviceUpdateLoader({ params }: LoaderFunctionArgs) {
	const serviceId = params.serviceId;
	invariant(serviceId, "Service ID is required");

	return {
		service: await window.api.db.services.getById(serviceId),
	};
}

export async function serviceUpdateAction({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const service = Object.fromEntries(formData) as unknown as UpdateServiceInput;
	const result = await window.api.db.services.update(service);

	if ("errors" in result) {
		return {
			errors: result.errors,
		};
	}

	return redirect("/services");
}

export function ServiceUpdateRoute() {
	const formRef = useRef<HTMLFormElement>(null);
	const { service } = useLoaderData<typeof serviceUpdateLoader>();
	const actionData = useActionData<typeof serviceUpdateAction>();
	useFormActionErrorFocus(formRef, actionData);

	const navigation = useNavigation();
	const isLoading = navigation.state !== "idle";
	const isSubmitting = navigation.state === "submitting";

	if (!service) {
		return (
			<section>
				<div>
					<p className="m-12">
						Sorry, but no service with this ID was found! Please click{" "}
						<Link
							aria-label="services list"
							className="hover:underline"
							to="/services"
						>
							Here
						</Link>{" "}
						to navigate back to your services list.
					</p>
				</div>
			</section>
		);
	}

	return (
		<section>
			<Form className="flex flex-col gap-4" method="post" ref={formRef}>
				<input name="serviceId" type="hidden" value={service.serviceId} />

				<FormField.Root errors={actionData?.errors?.nested?.name}>
					<FormField.Label>Name</FormField.Label>
					<FormField.Input
						defaultValue={service.name}
						name="name"
						type="text"
					/>
					<FormField.ErrorMessage />
				</FormField.Root>

				<FormField.Root errors={actionData?.errors?.nested?.description}>
					<FormField.Label>Description</FormField.Label>
					<FormField.Input
						defaultValue={service.description ?? ""}
						name="description"
						type="text"
					/>
					<FormField.ErrorMessage />
				</FormField.Root>

				<FormField.Root errors={actionData?.errors?.nested?.rate}>
					<FormField.Label>Rate (%)</FormField.Label>
					<FormField.NumberInput defaultValue={service.rate} name="rate" />
					<FormField.ErrorMessage />
				</FormField.Root>

				<Select
					defaultSelectedItem={statusOptions.find(
						(option) => option.value === service.status,
					)}
					errors={actionData?.errors?.nested?.status}
					items={statusOptions}
					label="Status"
					name="status"
				/>

				<Button disabled={isSubmitting} type="submit">
					{isLoading ? "Updating Service..." : "Update Service"}
				</Button>
			</Form>
		</section>
	);
}
