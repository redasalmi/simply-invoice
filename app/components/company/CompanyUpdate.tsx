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
import { Company, CompanyCustomField } from '~/types';

type CustomFieldProps = {
	field: CompanyCustomField;
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
					name={`custom-field-index-${customFieldId}`}
					value={index}
					className="hidden"
				/>

				<FormField
					id={`custom-label-${customFieldId}`}
					label="Label"
					name={`custom-label-${customFieldId}`}
					defaultValue={field.label}
					className="h-full flex-1"
					serverError={error?.label}
				/>

				<FormField
					id={`custom-content-${customFieldId}`}
					label="Content"
					name={`custom-content-${customFieldId}`}
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
	errors?: any;
	handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function CompanyUpdate({
	company,
	isSubmitting,
	isLoading,
	errors,
	handleSubmit,
}: CompanyUpdateProps) {
	const [customFields, setCustomFields] = React.useState(
		company.customFields ?? [],
	);

	const addField = () => {
		setCustomFields((prevFields) =>
			prevFields.concat({
				id: ulid(),
				order: prevFields.length,
				label: '',
				content: '',
			}),
		);
	};

	const deleteField = (id: string) => {
		setCustomFields((prevFields) =>
			prevFields.filter((field) => field.id !== id),
		);
	};

	return (
		<FormRoot asChild>
			<Form method="post" onSubmit={handleSubmit}>
				<input
					hidden
					readOnly
					name="company-id"
					className="hidden"
					value={company.companyId}
				/>

				<div>
					{companyFields.map((field) => (
						<FormField
							key={field.id}
							className="my-2"
							serverError={errors?.[field.name]}
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
								serverError={errors?.[field.name]}
								defaultValue={
									company.address[field.name.replace('address-', '')]
								}
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
											label: errors?.[`custom-label-${field.id}`],
											content: errors?.[`custom-content-${field.id}`],
										}}
										deleteField={() => deleteField(field.id)}
									/>
								))}
							</Reorder.Group>
						</div>
					) : null}
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