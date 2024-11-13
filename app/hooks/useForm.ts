import * as React from 'react';
import * as v from 'valibot';
import { parseFormData } from '~/utils/parseForm.utils';

export function useForm<T extends v.BaseSchema>({
	schema,
	actionErrors,
}: {
	schema: T;
	actionErrors?: Array<v.InferIssue<typeof schema>>;
}) {
	const [errors, setErrors] = React.useState<
		Array<v.InferIssue<typeof schema>> | undefined
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
			setErrors(newErrors);
			event.preventDefault();

			return;
		}

		setErrors(undefined);
	};

	return {
		errors,
		handleSubmit,
	};
}
