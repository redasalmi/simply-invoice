import { redirect, useNavigation, Form } from 'react-router';
import { getCustomer, updateCustomer } from '~/queries/customer.queries';
import { CustomerFormSchema } from '~/schemas/customer.schema';
import { updateAddress } from '~/queries/address.queries';
import { parseFormData } from '~/utils/parseForm.utils';
import { CustomerNotFound } from '~/routes/customers/components/CustomerNotFound';
import { FormField } from '~/components/FormField';
import { FormRoot } from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import { RichTextEditor } from '~/components/RichText/editor';
import { addressFields, customerFields } from '~/lib/constants';
import { useForm } from '~/hooks/useForm';
import type { StringReplace } from '~/types';
import type { Route } from './+types/customer-update';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const customerId = params.id;

	return {
		customer: await getCustomer(customerId),
	};
}

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const { data, errors } = parseFormData(formData, CustomerFormSchema);

	if (errors) {
		return {
			errors,
		};
	}

	await Promise.all([
		updateAddress(data.address),
		updateCustomer(data.customer),
	]);

	return redirect('/customers');
}

export default function CustomerUpdateRoute({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const customer = loaderData?.customer;

	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	const { errors, handleSubmit } = useForm({
		schema: CustomerFormSchema,
		actionErrors: actionData?.errors,
	});

	if (!customer) {
		return (
			<section>
				<CustomerNotFound />
			</section>
		);
	}

	return (
		<section>
			<FormRoot asChild>
				<Form method="post" onSubmit={handleSubmit}>
					<input type="hidden" name="customer-id" value={customer.customerId} />

					<div>
						{customerFields.map((field) => (
							<FormField
								key={field.id}
								className="my-2"
								serverError={errors?.nested?.[field.name]?.[0]}
								defaultValue={
									customer[
										field.name.replace('customer-', '') as StringReplace<
											typeof field.name,
											'customer-',
											''
										>
									]
								}
								{...field}
							/>
						))}
					</div>

					<div>
						<h3 className="text-2xl">Address</h3>
						<div>
							<input
								type="hidden"
								name="address-address-id"
								value={customer.address.addressId}
							/>

							{addressFields.map((field) => (
								<FormField
									key={field.id}
									className="my-2"
									serverError={errors?.nested?.[field.name]?.[0]}
									defaultValue={
										customer.address[
											field.name.replace('address-', '') as StringReplace<
												typeof field.name,
												'address-',
												''
											>
										]
									}
									{...field}
								/>
							))}
						</div>
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
								name="customer-additional-information"
								initialValue={customer.additionalInformation}
							/>
						</div>
					</div>

					<div>
						<Button disabled={isSubmitting} type="submit">
							{isLoading ? '...Updating' : 'Update'} Customer
						</Button>
					</div>
				</Form>
			</FormRoot>
		</section>
	);
}
