import * as React from 'react';
import { Form } from 'react-router';
import { FormField } from '~/components/FormField';
import { FormRoot } from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import { RichTextEditor } from '~/components/RichText/editor';
import { addressFields, companyFields } from '~/lib/constants';
import type { CompanyFormFlatErrors } from '~/schemas/company.schemas';

type CompanyCreateProps = {
	isSubmitting?: boolean;
	isLoading?: boolean;
	errors?: CompanyFormFlatErrors;
	handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function CompanyCreate({
	isSubmitting,
	isLoading,
	errors,
	handleSubmit,
}: CompanyCreateProps) {
	return (
		<FormRoot asChild>
			<Form method="post" onSubmit={handleSubmit}>
				<div>
					{companyFields.map((field) => (
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
							Add additional information about the company
						</p>
					</div>

					<div>
						<RichTextEditor name="company-additional-information" />
					</div>
				</div>

				<div>
					<Button disabled={isSubmitting} type="submit">
						{isLoading ? '...Saving' : 'Save'} Company
					</Button>
				</div>
			</Form>
		</FormRoot>
	);
}
