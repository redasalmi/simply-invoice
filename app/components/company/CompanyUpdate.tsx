import * as React from 'react';
import { Form } from 'react-router';
import { Reorder } from 'framer-motion';
import { MoveIcon, TrashIcon } from 'lucide-react';
import { FormField } from '~/components/FormField';
import { FormRoot } from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import { RichTextEditor } from '~/components/RichText/editor';
import { addressFields, companyFields } from '~/lib/constants';
import { cn } from '~/utils/shared.utils';
import {
	customFieldActionKey,
	customFieldContentKey,
	customFieldIndexKey,
	customFieldLabelKey,
} from '~/schemas/customField.schema';
import type { Company, CompanyCustomField } from '~/types';
import type { CompanyFormFlatErrors } from '~/schemas/company.schemas';

type CustomField = CompanyCustomField & {
	action: 'create' | 'update' | 'delete';
};

type CustomFieldProps = {
	field: CustomField;
	index: number;
	error?: {
		label?: string;
		content?: string;
	};
	deleteField: () => void;
};

function CustomField({ field, index, error, deleteField }: CustomFieldProps) {
	const containerRef = React.useRef<HTMLDivElement | null>(null);
	const [hasError, setHasError] = React.useState(false);

	const customFieldId = field.companyCustomFieldId;

	React.useEffect(() => {
		if (!containerRef.current) {
			return;
		}

		const observer = new MutationObserver(() => {
			const hasDataInvalid = Boolean(
				containerRef.current?.querySelectorAll('[data-invalid=true]').length,
			);
			setHasError(hasDataInvalid);
		});

		observer.observe(containerRef.current, {
			attributes: true,
			subtree: true,
		});

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<Reorder.Item
			value={field}
			className={cn(field.action === 'delete' && 'hidden')}
		>
			<div
				ref={containerRef}
				className={cn(
					'my-2 grid grid-cols-[auto_1fr_1fr_auto] items-end gap-2',
					hasError && 'items-center',
				)}
			>
				<div>
					<Button variant="icon" className="active:cursor-grab">
						<MoveIcon />
					</Button>
				</div>

				<input
					hidden
					readOnly
					name={`${customFieldActionKey}-${customFieldId}`}
					value={field.action}
					className="hidden"
				/>

				<input
					hidden
					readOnly
					name={`${customFieldIndexKey}-${customFieldId}`}
					value={index}
					className="hidden"
				/>

				<FormField
					id={`${customFieldLabelKey}-${customFieldId}`}
					label="Label"
					name={`${customFieldLabelKey}-${customFieldId}`}
					defaultValue={field.label}
					className="h-full flex-1"
					serverError={error?.label}
				/>

				<FormField
					id={`${customFieldContentKey}-${customFieldId}`}
					label="Content"
					name={`${customFieldContentKey}-${customFieldId}`}
					defaultValue={field.content}
					className="h-full flex-1"
					serverError={error?.content}
				/>

				<div className="flex gap-2">
					<Button
						aria-label="delete field"
						variant="icon"
						onClick={deleteField}
					>
						<TrashIcon />
					</Button>
				</div>
			</div>
		</Reorder.Item>
	);
}

type CompanyUpdateProps = {
	company: Company;
	isSubmitting?: boolean;
	isLoading?: boolean;
	errors?: CompanyFormFlatErrors;
	handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function CompanyUpdate({
	company,
	isSubmitting,
	isLoading,
	errors,
	handleSubmit,
}: CompanyUpdateProps) {
	return (
		<FormRoot asChild>
			<Form method="post" onSubmit={handleSubmit}>
				<input type="hidden" name="company-id" value={company.companyId} />

				<div>
					{companyFields.map((field) => (
						<FormField
							key={field.id}
							className="my-2"
							serverError={errors?.nested?.[field.name]?.[0]}
							defaultValue={company[field.name.replace('company-', '')]}
							{...field}
						/>
					))}
				</div>

				<div>
					<h3 className="text-2xl">Address</h3>
					<div>
						<input
							hidden
							readOnly
							name={`address-address-id`}
							className="hidden"
							value={company.address.addressId}
						/>

						{addressFields.map((field) => (
							<FormField
								key={field.id}
								className="my-2"
								serverError={errors?.nested?.[field.name]?.[0]}
								defaultValue={
									company.address[field.name.replace('address-', '')]
								}
								{...field}
							/>
						))}
					</div>
				</div>

				<div>
					<div>
						<h3 className="text-2xl">Additional Information</h3>
						<p className="mb-2 block text-sm">
							Add additional information about the company
						</p>
					</div>

					<div>
						<RichTextEditor
							name="company-additional-information"
							initialValue={company.additionalInformation}
						/>
					</div>
				</div>

				<div>
					<Button disabled={isSubmitting} type="submit">
						{isLoading ? '...Updating' : 'Update'} Company
					</Button>
				</div>
			</Form>
		</FormRoot>
	);
}
