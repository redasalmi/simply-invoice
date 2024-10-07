import { redirect, useNavigation } from 'react-router';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { db } from '~/lib/db';
import { UpdateEntityForm } from '~/components/entity/Update';
import { EntityNotFound } from '~/components/entity/Error';
import { parseCustomFields } from '~/utils/parseCustomFields.utils';
import { entityFormSchema } from '~/schemas/entity.schemas';
import { parseFormData } from '~/utils/parseForm.utils';
import type { UpdateCompany } from '~/types/company.types';
import { useForm } from '~/hooks/useForm';
import type * as Route from './+types.company-update';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const companyId = params.id;

	return {
		company: await db.companies.get(companyId),
	};
}

export async function clientAction({
	params,
	request,
}: Route.ClientActionArgs) {
	const companyId = params.id;

	const formData = await request.formData();
	const { data, errors } = parseFormData(formData, entityFormSchema);

	if (errors) {
		return {
			errors,
		};
	}

	const today = new Date().toISOString();
	const updatedCompany = {
		custom: parseCustomFields(formData),
		updatedAt: today,
	} as UpdateCompany;

	for (const key in data) {
		if (key.includes('custom')) {
			continue;
		}

		updatedCompany[key.replace('-', '.') as keyof UpdateCompany] =
			data[key as keyof typeof data];
	}
	await db.companies.update(companyId, updatedCompany);

	return redirect('/companies');
}

export function HydrateFallback() {
	return (
		<section>
			<div>
				<div className="my-2">
					<p className="mb-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Name *
					</p>
					<Skeleton className="h-10" />
				</div>
				<div className="my-2">
					<p className="mb-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Email *
					</p>
					<Skeleton className="h-10" />
				</div>
			</div>

			<div>
				<h3 className="text-2xl">Address</h3>

				<div className="my-2">
					<p className="mb-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Address 1 *
					</p>
					<Skeleton className="h-10" />
				</div>
				<div className="my-2">
					<p className="mb-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Address 2
					</p>
					<Skeleton className="h-10" />
				</div>
				<div className="my-2">
					<p className="mb-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Country *
					</p>
					<Skeleton className="h-10" />
				</div>
				<div className="my-2">
					<p className="mb-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Province
					</p>
					<Skeleton className="h-10" />
				</div>
				<div className="my-2">
					<p className="mb-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						City
					</p>
					<Skeleton className="h-10" />
				</div>
				<div className="my-2">
					<p className="mb-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Zip
					</p>
					<Skeleton className="h-10" />
				</div>
			</div>

			<div className="my-2">
				<h3 className="text-2xl">Custom Fields</h3>
				<p className="mb-2 block text-sm">
					Add any custom fields and order them
				</p>
				<div>
					<Button>Add New Field</Button>
				</div>
			</div>

			<div>
				<Button>Update Company</Button>
			</div>
		</section>
	);
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
		schema: entityFormSchema,
		actionErrors: actionData?.errors,
	});

	if (!company) {
		return (
			<section>
				<EntityNotFound type="company" baseUrl="/companies" />
			</section>
		);
	}

	return (
		<section>
			<UpdateEntityForm
				type="company"
				entity={company}
				isLoading={isLoading}
				isSubmitting={isSubmitting}
				errors={errors}
				handleSubmit={handleSubmit}
			/>
		</section>
	);
}
