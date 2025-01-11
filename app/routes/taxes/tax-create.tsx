import { useNavigation, redirect } from 'react-router';
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
	NumberFieldRoot,
} from '~/components/ui/number-field';
import { useForm } from '~/hooks/useForm';
import { TaxFormSchema } from '~/schemas/tax.schemas';
import { parseFormData } from '~/utils/parseForm.utils';
import { createTax } from '~/queries/tax.queries';
import type { Route } from './+types/tax-create';

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const { data: tax, errors } = parseFormData(formData, TaxFormSchema);

	if (errors) {
		return {
			errors,
		};
	}

	await createTax(tax);

	return redirect('/taxes');
}

export default function TaxCreateRoute({ actionData }: Route.ComponentProps) {
	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	const { errors, resetErrors, handleSubmit } = useForm({
		schema: TaxFormSchema,
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
				<FieldRoot name="name" className="my-2">
					<FieldLabel>Name</FieldLabel>
					<FieldControl type="text" />
					<FieldError />
				</FieldRoot>

				<FieldRoot name="rate" className="my-2" onChange={resetErrors}>
					{/* TODO: improve this when a new version is released or some examples are available */}
					<FieldLabel>Rate (%)</FieldLabel>
					<NumberFieldRoot name="rate">
						<NumberFieldGroup>
							<NumberFieldDecrement />
							<NumberFieldInput />
							<NumberFieldIncrement />
						</NumberFieldGroup>
					</NumberFieldRoot>
					<FieldError />
				</FieldRoot>

				<Button disabled={isSubmitting} type="submit">
					{isLoading ? 'Saving Tax...' : 'Save Tax'}
				</Button>
			</Form>
		</section>
	);
}
