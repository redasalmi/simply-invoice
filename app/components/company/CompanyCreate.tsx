import * as React from 'react';
import { Form } from 'react-router';
import { ulid } from 'ulid';
import { Reorder } from 'framer-motion';
import { MoveIcon, TrashIcon } from 'lucide-react';
import { FormField } from '~/components/FormField';
import { FormRoot } from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import { addressFields, companyFields } from '~/lib/constants';
import { cn } from '~/utils/shared.utils';
import {
	customFieldContentKey,
	customFieldIndexKey,
	customFieldLabelKey,
} from '~/schemas/customField.schema';
import type { CompanyFormFlatErrors } from '~/schemas/company.schemas';

type CustomFieldProps = {
	field: {
		companyCustomFieldId: string;
	};
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
		<Reorder.Item value={field}>
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
					name={`${customFieldIndexKey}-${customFieldId}`}
					value={index}
					className="hidden"
				/>

				<FormField
					id={`${customFieldLabelKey}-${customFieldId}`}
					label="Label"
					name={`${customFieldLabelKey}-${customFieldId}`}
					className="h-full flex-1"
					serverError={error?.label}
				/>

				<FormField
					id={`${customFieldContentKey}-${customFieldId}`}
					label="Content"
					name={`${customFieldContentKey}-${customFieldId}`}
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

type CompanyCreateProps = {
	isSubmitting?: boolean;
	isLoading?: boolean;
	errors?: CompanyFormFlatErrors;
	handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function CompanyCreate({
	isSubmitting,
	isLoading,
	errors,
	handleSubmit,
}: CompanyCreateProps) {
	const [customFields, setCustomFields] = React.useState<
		Array<{ companyCustomFieldId: string }>
	>([]);

	const addField = () => {
		setCustomFields((prevFields) =>
			prevFields.concat({ companyCustomFieldId: ulid() }),
		);
	};

	const deleteField = (companyCustomFieldId: string) => {
		setCustomFields((prevFields) =>
			prevFields.filter(
				(field) => field.companyCustomFieldId !== companyCustomFieldId,
			),
		);
	};

	return (
		<FormRoot asChild>
			<Form method="post" onSubmit={handleSubmit}>
				<div>
					{companyFields.map((field) => (
						<FormField
							key={field.id}
							className="my-2"
							serverError={errors?.nested?.[field.name]?.[0]}
							{...field}
						/>
					))}
				</div>

				<div>
					<h3 className="text-2xl">Address</h3>
					<div>
						{addressFields.map((field) => (
							<FormField
								key={field.id}
								className="my-2"
								serverError={errors?.nested?.[field.name]?.[0]}
								{...field}
							/>
						))}
					</div>
				</div>

				<div>
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-2xl">Custom Fields</h3>
							<p className="mb-2 block text-sm">
								Add any custom fields and order them
							</p>
						</div>
						<div>
							<Button onClick={addField}>Add New Custom Field</Button>
						</div>
					</div>

					{customFields.length ? (
						<div>
							<Reorder.Group values={customFields} onReorder={setCustomFields}>
								{customFields.map((field, index) => (
									<CustomField
										key={field.companyCustomFieldId}
										field={field}
										index={index}
										error={{
											label:
												errors?.nested?.[
													`${customFieldLabelKey}-${field.companyCustomFieldId}`
												]?.[0],
											content:
												errors?.nested?.[
													`${customFieldContentKey}-${field.companyCustomFieldId}`
												]?.[0],
										}}
										deleteField={() => deleteField(field.companyCustomFieldId)}
									/>
								))}
							</Reorder.Group>
						</div>
					) : null}
				</div>

				<div>
					<Button disabled={isSubmitting} type="submit">
						{isLoading ? '...Saving' : 'Save'} Company
					</Button>
				</div>
			</Form>
		</FormRoot>
	);
}
