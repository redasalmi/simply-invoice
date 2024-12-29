import { redirect, useNavigation } from 'react-router';
import { getCustomer, updateCustomer } from '~/queries/customer.queries';
import { CustomerFormSchema } from '~/schemas/customer.schema';
import { updateAddress } from '~/queries/address.queries';
import { parseFormData } from '~/utils/parseForm.utils';
import { CustomerNotFound } from '~/routes/customers/components/CustomerNotFound';
import { Form } from '~/components/ui/form';
import {
	FieldRoot,
	FieldLabel,
	FieldControl,
	FieldError,
} from '~/components/ui/field';
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

	const { errors, resetErrors, handleSubmit } = useForm({
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
			<Form
				method="post"
				errors={errors?.nested}
				onClearErrors={resetErrors}
				onSubmit={handleSubmit}
			>
				<input type="hidden" name="customer-id" value={customer.customerId} />

				<div>
					{customerFields.map((field) => (
						<FieldRoot key={field.id} name={field.name} className="my-2">
							<FieldLabel>{field.label}</FieldLabel>
							<FieldControl
								type="text"
								defaultValue={
									customer[
										field.name.replace('customer-', '') as StringReplace<
											typeof field.name,
											'customer-',
											''
										>
									]
								}
							/>
							<FieldError />
						</FieldRoot>
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
							<FieldRoot key={field.id} name={field.name} className="my-2">
								<FieldLabel>{field.label}</FieldLabel>
								<FieldControl
									type="text"
									defaultValue={
										customer.address[
											field.name.replace('address-', '') as StringReplace<
												typeof field.name,
												'address-',
												''
											>
										]
									}
								/>
								<FieldError />
							</FieldRoot>
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
		</section>
	);
}
