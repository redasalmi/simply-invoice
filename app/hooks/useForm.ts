import * as React from 'react';
import * as v from 'valibot';
import { parseFormData } from '~/utils/parseForm.utils';

export function useForm<T extends v.BaseSchema>({
	schema,
	actionIssues,
}: {
	schema: T;
	actionIssues?: Array<v.InferIssue<typeof schema>>;
}) {
	const [issues, setIssues] = React.useState<
		Array<v.InferIssue<typeof schema>> | undefined
	>(undefined);

	React.useEffect(() => {
		if (actionIssues) {
			setIssues(actionIssues);
		}
	}, [actionIssues]);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		const formData = new FormData(event.currentTarget);

		const { issues: newIssues } = parseFormData(formData, schema);
		if (newIssues) {
			setIssues(newIssues);
			event.preventDefault();

			return;
		}

		setIssues(undefined);
	};

	return {
		issues,
		handleSubmit,
	};
}
