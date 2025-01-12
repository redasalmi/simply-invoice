import { redirect, useNavigation } from 'react-router';
import { CustomerFormSchema } from '~/routes/customers/customer.schema';
import { createCustomer } from '~/routes/customers/queries/customer.queries';
import { createAddress } from '~/lib/address/address.queries';
import { Form } from '~/components/ui/form';
import {
	FieldRoot,
	FieldLabel,
	FieldControl,
	FieldError,
} from '~/components/ui/field';
import { Button } from '~/components/ui/button';
import { RichTextEditor } from '~/components/rich-text/editor';
import { parseFormData } from '~/utils/parseForm.utils';
import { addressFields, customerFields } from '~/lib/constants';
import { useForm } from '~/hooks/useForm';
import type { Route } from './+types/customer-create';

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const { data, errors } = parseFormData(formData, CustomerFormSchema);

	if (errors) {
		return {
			errors,
		};
	}

	await createAddress(data.address);
	await createCustomer(data.customer);

	return redirect('/customers');
}

export default function CustomerCreateRoute({
	actionData,
}: Route.ComponentProps) {
	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	const { errors, resetErrors, handleSubmit } = useForm({
		schema: CustomerFormSchema,
		actionErrors: actionData?.errors,
	});

	return (
		<section>
			<Form
				method="post"
				errors={errors?.nested}
				onClearErrors={resetErrors}
				onSubmit={handleSubmit}
			>
				<div>
					{customerFields.map((field) => (
						<FieldRoot key={field.id} name={field.name} className="my-2">
							<FieldLabel>{field.label}</FieldLabel>
							<FieldControl type={field.type} />
							<FieldError />
						</FieldRoot>
					))}
				</div>

				<div>
					<h3 className="text-2xl">Address</h3>
					<div>
						{addressFields.map((field) => (
							<FieldRoot key={field.id} name={field.name} className="my-2">
								<FieldLabel>{field.label}</FieldLabel>
								<FieldControl type="text" />
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
						<RichTextEditor name="customer-additional-information" />
					</div>
				</div>

				<div>
					<Button disabled={isSubmitting} type="submit">
						{isLoading ? '...Saving' : 'Save'} Customer
					</Button>
				</div>
			</Form>
		</section>
	);
}
