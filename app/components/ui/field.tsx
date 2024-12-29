import { Field } from '@base-ui-components/react';
import { cn } from '~/utils/shared.utils';

export function FieldRoot(props: Field.Root.Props) {
	return <Field.Root {...props} />;
}

export function FieldLabel(props: Field.Label.Props) {
	return (
		<Field.Label
			{...props}
			className="mb-1 block text-sm font-medium text-gray-900"
		/>
	);
}

export function FieldControl(props: Field.Control.Props) {
	return (
		<Field.Control
			{...props}
			className={cn(
				'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500',
				'data-[invalid]:border-red-500 data-[invalid]:bg-red-50 data-[invalid]:text-red-900 data-[invalid]:placeholder-red-700 data-[invalid]:focus:border-red-500 data-[invalid]:focus:ring-red-500',
			)}
		/>
	);
}

export function FieldDescription(props: Field.Description.Props) {
	return <Field.Description {...props} />;
}

export function FieldError(props: Field.Error.Props) {
	return <Field.Error {...props} className="font-medium text-red-900" />;
}

export function FieldValidity(props: Field.Validity.Props) {
	return <Field.Validity {...props} />;
}
