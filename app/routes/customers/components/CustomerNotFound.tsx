import { Link } from 'react-router';

export function CustomerNotFound() {
	return (
		<p className="m-12">
			Sorry, but no customer with this ID was found! Please click{' '}
			<Link
				to="/customers"
				className="hover:underline"
				aria-label={`customers list`}
			>
				Here
			</Link>{' '}
			to navigate back to your customers list.
		</p>
	);
}
