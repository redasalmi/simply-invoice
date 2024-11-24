import { redirect, useNavigate, useNavigation } from 'react-router';
import { deleteCompany, getCompany } from '~/queries/company.queries';
import { CompanyDelete } from '~/components/company/CompanyDelete';
import type { Route } from './+types/company-delete';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const companyId = params.id;

	return {
		company: await getCompany(companyId),
	};
}

export async function clientAction({ params }: Route.ClientActionArgs) {
	try {
		const companyId = params.id;
		const company = await getCompany(companyId);
		if (!company) {
			return {
				errors: {
					message: 'No Company Found!',
					description: `Sorry but no company with this ID: ${companyId} was found. Click the continue button to navigate back to your companies list.`,
				},
			};
		}

		await deleteCompany(companyId);

		return redirect('/companies');
	} catch {
		return {
			errors: {
				message: 'Error Deleting the Company!',
				description:
					'An error happened while deleting your company, please try again later.',
			},
		};
	}
}

export default function CompanyDeleteRoute({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const navigate = useNavigate();
	const navigation = useNavigation();

	const company = loaderData?.company;
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	const closeAlert = () => {
		navigate('/companies');
	};

	return (
		<CompanyDelete
			company={company}
			errors={actionData?.errors}
			isLoading={isLoading}
			isSubmitting={isSubmitting}
			closeAlert={closeAlert}
		/>
	);
}
