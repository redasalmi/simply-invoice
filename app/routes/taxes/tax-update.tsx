import { Link, redirect, useNavigation } from 'react-router';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import {
	FieldRoot,
	FieldLabel,
	FieldControl,
	FieldError,
} from '~/components/ui/field';
import {
	NumberFieldDecrement,
	NumberFieldGroup,
	NumberFieldIncrement,
	NumberFieldInput,
	NumberFieldLabel,
	NumberFieldRoot,
} from '~/components/ui/number-field';
import { getTax, updateTax } from '~/queries/tax.queries';
import { TaxFormSchema } from '~/schemas/tax.schemas';
import { useForm } from '~/hooks/useForm';
import { parseFormData } from '~/utils/parseForm.utils';
import type { Route } from './+types/tax-update';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const taxId = params.id;

	return {
		tax: await getTax(taxId),
	};
}

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const { data: tax, errors } = parseFormData(formData, TaxFormSchema);

	if (errors) {
		return {
			errors,
		};
	}

	await updateTax(tax);

	return redirect('/taxes');
}

export default function TaxUpdateRoute({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const navigation = useNavigation();

	const tax = loaderData?.tax;
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	const { errors, resetErrors, handleSubmit } = useForm({
		schema: TaxFormSchema,
		actionErrors: actionData?.errors,
	});

	if (!tax) {
		return (
			<section>
				<div>
					<p className="m-12">
						Sorry, but no tax with this ID was found! Please click{' '}
						<Link
							to="/taxes"
							aria-label="taxes list"
							className="hover:underline"
						>
							Here
						</Link>{' '}
						to navigate back to your taxes list.
					</p>
				</div>
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
				<input type="hidden" name="tax-id" value={tax.taxId} />

				<FieldRoot name="name" className="my-2">
					<FieldLabel>Name</FieldLabel>
					<FieldControl type="text" defaultValue={tax.name} />
					<FieldError />
				</FieldRoot>

				<FieldRoot name="rate" className="my-2">
					{/* NumberField is not integrated very well with the Form component for now, 
								that's why it's wrapper with a FieldRoot, look into this when a new version is released  
							*/}
					<NumberFieldRoot
						id="rate"
						name="rate"
						defaultValue={tax.rate}
						onValueChange={resetErrors}
					>
						<NumberFieldLabel htmlFor="rate">Rate (%)</NumberFieldLabel>
						<NumberFieldGroup>
							<NumberFieldDecrement />
							<NumberFieldInput name="rate" />
							<NumberFieldIncrement />
						</NumberFieldGroup>
					</NumberFieldRoot>
					<FieldError />
				</FieldRoot>

				<Button disabled={isSubmitting} type="submit">
					{isLoading ? 'Updating Tax...' : 'Update Tax'}
				</Button>
			</Form>
		</section>
	);
}