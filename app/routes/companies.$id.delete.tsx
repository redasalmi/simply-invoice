import {
	type ClientActionFunctionArgs,
	type ClientLoaderFunctionArgs,
	redirect,
	useActionData,
	useLoaderData,
	useNavigate,
	useNavigation,
} from '@remix-run/react';
import invariant from 'tiny-invariant';
import { DeleteEntity, DeleteEntityError } from '~/components/Entity/delete';
import { db } from '~/lib/db';

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
	invariant(params.id, 'Company ID is required');
	const companyId = params.id;

	return {
		company: await db.companies.get(companyId),
	};
}

export async function clientAction({ params }: ClientActionFunctionArgs) {
	invariant(params.id, 'Company ID is required');

	try {
		const companyId = params.id;
		const company = await db.companies.get(companyId);
		if (!company) {
			return {
				error: {
					message: 'No Company Found!',
					description: `Sorry but no company with this ID: ${companyId} was found. Click the continue button to navigate back to your companies list.`,
				},
			};
		}

		await db.companies.delete(companyId);

		return redirect('/companies');
	} catch (err) {
		return {
			error: {
				message: 'Error Deleting the Company!',
				description:
					'An error happened while deleting your company, please try again later.',
			},
		};
	}
}

export default function CompanyDeleteRoute() {
	const { company } = useLoaderData<typeof clientLoader>();
	const actionData = useActionData<typeof clientAction>();
	const navigate = useNavigate();
	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	const closeAlert = () => {
		navigate('/companies');
	};

	if (!company) {
		return (
			<DeleteEntityError
				type="company"
				error={actionData?.error}
				closeAlert={closeAlert}
			/>
		);
	}

	return (
		<DeleteEntity
			type="company"
			entityName={company.name}
			isLoading={isLoading}
			isSubmitting={isSubmitting}
			closeAlert={closeAlert}
		/>
	);
}
