import * as React from 'react';
import type { z } from 'zod';
import {
	type FormErrors,
	type FormSchema,
	parseFormData,
} from '~/utils/parseForm.utils';

type useFormParams<T extends z.ZodRawShape> = {
	schema: FormSchema<T>;
	actionErrors?: FormErrors<T>;
};

export function useForm<T extends z.ZodRawShape>({
	schema,
	actionErrors,
}: useFormParams<T>) {
	const [errors, setErrors] = React.useState<FormErrors<T> | undefined>(
		undefined,
	);

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
