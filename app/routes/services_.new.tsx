import * as React from 'react';
import type { ActionFunctionArgs } from '@remix-run/node';
import { Form, redirect, useActionData, useNavigation } from '@remix-run/react';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { UncontrolledFormField } from '~/components/FormField';
import { Button } from '~/components/ui/button';
import { db } from '~/lib/db';
import type { Field } from '~/lib/types';
import { createService, getServiceActionErrors } from '~/utils/service';

export async function clientAction({ request }: ActionFunctionArgs) {
	try {
		const formData = await request.formData();
		const newService = createService(formData);
		await db.services.add(newService);

		return redirect('/services');
	} catch (err) {
		if (err instanceof z.ZodError) {
			const errors = getServiceActionErrors<'create'>(err);

			return {
				errors,
			};
		}
	}
}

const servicesFields: Array<Field> = [
	{
		id: nanoid(),
		label: 'Name *',
		name: 'name',
		input: {
			required: true,
		},
	},
	{
		id: nanoid(),
		label: 'Description',
		name: 'description',
	},
	{
		id: nanoid(),
		label: 'Rate *',
		name: 'rate',
		input: {
			type: 'number',
			required: true,
		},
	},
];

export default function NewServiceRoute() {
	const actionData = useActionData<typeof clientAction>();
	// const { toast } = useToast();
	// const dismissRef = React.useRef<(() => void) | null>(null);

	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';
	const isSubmitting = navigation.state === 'submitting';

	// React.useEffect(() => {
	// 	if (isSubmitting) {
	// 		dismissRef.current = toast({
	// 			title: 'Saving Service',
	// 		}).dismiss;
	// 	}
	// }, [toast, isSubmitting]);

	// React.useEffect(() => {
	// 	return () => {
	// 		if (dismissRef.current) {
	// 			dismissRef.current();
	// 		}
	// 	};
	// }, []);

	return (
		<section>
			<Form method="POST">
				{servicesFields.map((field) => (
					<UncontrolledFormField
						key={field.id}
						className="my-2"
						formField={{
							...field,
							error: actionData?.errors?.[field.name],
						}}
					/>
				))}

				<Button disabled={isSubmitting} type="submit">
					{isLoading ? 'Saving Service...' : 'Save Service'}
				</Button>
			</Form>
		</section>
	);
}
