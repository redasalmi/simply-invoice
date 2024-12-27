import * as React from 'react';
import * as v from 'valibot';
import { parseFormData } from '~/utils/parseForm.utils';

export function useForm<
	T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>({
	schema,
	actionErrors,
}: {
	schema: T;
	actionErrors?: v.FlatErrors<typeof schema>;
}) {
	const [errors, setErrors] = React.useState<
		v.FlatErrors<typeof schema> | undefined
	>(undefined);

	React.useEffect(() => {
		if (actionErrors) {
			setErrors(actionErrors);
		}
	}, [actionErrors]);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		const formData = new FormData(event.currentTarget);
		const { errors: newErrors } = parseFormData(formData, schema);

		if (newErrors) {
			event.preventDefault();
			setErrors(newErrors);

			return;
		}

		setErrors(undefined);
	};

	return {
		errors,
		handleSubmit,
	};
}
