import * as React from 'react';
import type { z } from 'zod';

type useFormParams<T> = {
	schema: z.Schema;
	actionErrors?: T;
	parseErrors: (err: z.ZodError) => T;
};

export function useForm<T>({
	schema,
	actionErrors,
	parseErrors,
}: useFormParams<T>) {
	const [errors, setErrors] = React.useState<typeof actionErrors>(undefined);

	React.useEffect(() => {
		if (actionErrors) {
			setErrors(actionErrors);
		}
	}, [actionErrors]);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		const formData = new FormData(event.currentTarget);

		const object: Record<string, FormDataEntryValue> = {};
		formData.forEach((value, key) => {
			object[key] = value;
		});

		const parsedObject = schema.safeParse(object);
		if (parsedObject.error) {
			const newErrors = parseErrors(parsedObject.error);
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
