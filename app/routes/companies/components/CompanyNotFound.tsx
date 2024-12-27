import { Link } from 'react-router';

export function CompanyNotFound() {
	return (
		<p className="m-12">
			Sorry, but no company with this ID was found! Please click{' '}
			<Link
				to="/companies"
				className="hover:underline"
				aria-label={`companies list`}
			>
				Here
			</Link>{' '}
			to navigate back to your companies list.
		</p>
	);
}
