import { redirect, useNavigation, Form } from 'react-router';
import { getCompany, updateCompany } from '~/queries/company.queries';
import { CompanyFormSchema } from '~/schemas/company.schemas';
import { updateAddress } from '~/queries/address.queries';
import { parseFormData } from '~/utils/parseForm.utils';
import { CompanyNotFound } from '~/routes/companies/components/CompanyNotFound';
import { FormField } from '~/components/FormField';
import { FormRoot } from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import { RichTextEditor } from '~/components/RichText/editor';
import { addressFields, companyFields } from '~/lib/constants';
import { useForm } from '~/hooks/useForm';
import type { StringReplace } from '~/types';
import type { Route } from './+types/company-update';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const companyId = params.id;

	return {
		company: await getCompany(companyId),
	};
}

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const { data, errors } = parseFormData(formData, CompanyFormSchema);

	if (errors) {
		return {
			errors,
		};
	}

	await Promise.all([updateAddress(data.address), updateCompany(data.company)]);

	return redirect('/companies');
}

export default function CompanyUpdateRoute({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const company = loaderData?.company;

	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	const { errors, handleSubmit } = useForm({
		schema: CompanyFormSchema,
		actionErrors: actionData?.errors,
	});

	if (!company) {
		return (
			<section>
				<CompanyNotFound />
			</section>
		);
	}

	return (
		<section>
			<FormRoot asChild>
				<Form method="post" onSubmit={handleSubmit}>
					<input type="hidden" name="company-id" value={company.companyId} />

					<div>
						{companyFields.map((field) => (
							<FormField
								key={field.id}
								className="my-2"
								serverError={errors?.nested?.[field.name]?.[0]}
								defaultValue={
									company[
										field.name.replace('company-', '') as StringReplace<
											typeof field.name,
											'company-',
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
								value={company.address.addressId}
							/>

							{addressFields.map((field) => (
								<FormField
									key={field.id}
									className="my-2"
									serverError={errors?.nested?.[field.name]?.[0]}
									defaultValue={
										company.address[
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
								Add additional information about the company
							</p>
						</div>

						<div>
							<RichTextEditor
								name="company-additional-information"
								initialValue={company.additionalInformation}
							/>
						</div>
					</div>

					<div>
						<Button disabled={isSubmitting} type="submit">
							{isLoading ? '...Updating' : 'Update'} Company
						</Button>
					</div>
				</Form>
			</FormRoot>
		</section>
	);
}
