import { redirect, useNavigation, Form } from 'react-router';
import { CustomerFormSchema } from '~/schemas/customer.schema';
import { createCustomer } from '~/queries/customer.queries';
import { createAddress } from '~/queries/address.queries';
import { FormField } from '~/components/FormField';
import { FormRoot } from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import { RichTextEditor } from '~/components/RichText/editor';
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

	await Promise.all([
		createAddress(data.address),
		createCustomer(data.customer),
	]);

	return redirect('/customers');
}

export default function CustomerCreateRoute({
	actionData,
}: Route.ComponentProps) {
	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	const { errors, handleSubmit } = useForm({
		schema: CustomerFormSchema,
		actionErrors: actionData?.errors,
	});

	return (
		<section>
			<FormRoot asChild>
				<Form method="post" onSubmit={handleSubmit}>
					<div>
						{customerFields.map((field) => (
							<FormField
								key={field.id}
								className="my-2"
								serverError={errors?.nested?.[field.name]?.[0]}
								{...field}
							/>
						))}
					</div>

					<div>
						<h3 className="text-2xl">Address</h3>
						<div>
							{addressFields.map((field) => (
								<FormField
									key={field.id}
									className="my-2"
									serverError={errors?.nested?.[field.name]?.[0]}
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
							<RichTextEditor name="customer-additional-information" />
						</div>
					</div>

					<div>
						<Button disabled={isSubmitting} type="submit">
							{isLoading ? '...Saving' : 'Save'} Customer
						</Button>
					</div>
				</Form>
			</FormRoot>
		</section>
	);
}
