import {
	type ClientActionFunctionArgs,
	type ClientLoaderFunctionArgs,
	redirect,
	useActionData,
	useLoaderData,
	useNavigation,
} from '@remix-run/react';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { db } from '~/lib/db';
import { UpdateEntityForm } from '~/components/Entities/update';
import { EntityNotFound } from '~/components/Entities/error';
import {
	parseUpdateEntityErrors,
	parseUpdateEntityForm,
} from '~/utils/entity.utils';
import type { UpdateCompany } from '~/types/company.types';
import { updateEntitySchema } from '~/schemas/entity.schemas';

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
	invariant(params.id, 'Company ID is required');
	const companyId = params.id;

	return {
		company: await db.companies.get(companyId),
	};
}

export async function clientAction({
	params,
	request,
}: ClientActionFunctionArgs) {
	invariant(params.id, 'Company ID is required');

	try {
		const companyId = params.id;
		const formData = await request.formData();
		const updatedCompany = parseUpdateEntityForm<UpdateCompany>(
			companyId,
			formData,
		);
		updateEntitySchema.parse(updatedCompany);
		await db.companies.update(companyId, updatedCompany);

		return redirect('/companies');
	} catch (err) {
		if (err instanceof z.ZodError) {
			const errors = parseUpdateEntityErrors(err);

			return {
				errors,
			};
		}
	}
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
					<Button type="button">Add New Field</Button>
				</div>
			</div>

			<div>
				<Button type="button">Update Company</Button>
			</div>
		</section>
	);
}

export default function CompanyUpdateRoute() {
	const { company } = useLoaderData<typeof clientLoader>();
	const actionData = useActionData<typeof clientAction>();

	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

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
				errors={actionData?.errors}
			/>
		</section>
	);
}
