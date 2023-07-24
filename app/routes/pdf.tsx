import { json } from '@remix-run/node';

import type { ActionArgs, ActionFunction } from '@remix-run/node';

export const action: ActionFunction = async ({ request }: ActionArgs) => {
	const body = await request.formData();
	const formData = Array.from(body.entries());

	return json({});
};

export default function Pdf() {
	return (
		<main className="container mx-auto">
			<h1 className="text-4xl">PDF Viewer/Generator</h1>
		</main>
	);
}
