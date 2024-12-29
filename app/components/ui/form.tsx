import { Form as RemixForm } from 'react-router';
import { Form as UIForm } from '@base-ui-components/react';

export function Form(props: UIForm.Props) {
	return <UIForm render={<RemixForm />} {...props} />;
}
