import {
	Group,
	type GroupProps,
	composeRenderProps,
} from 'react-aria-components';
import { fieldGroupStyles } from '~/components/react-aria/utils';

export function FieldGroup(props: GroupProps) {
	return (
		<Group
			{...props}
			className={composeRenderProps(props.className, (className, renderProps) =>
				fieldGroupStyles({ ...renderProps, className }),
			)}
		/>
	);
}
