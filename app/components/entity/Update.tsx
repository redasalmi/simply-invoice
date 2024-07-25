import * as React from 'react';
import { Form } from '@remix-run/react';
import { ulid } from 'ulid';
import { Reorder } from 'framer-motion';
import { MoveIcon, TrashIcon } from 'lucide-react';
import { FormField } from '~/components/FormField';
import { FormRoot } from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import { Switch } from '~/components/ui/switch';
import { addressFields, informationFields } from '~/lib/constants';
import { capitalize } from '~/utils/shared.utils';
import type {
	EntityType,
	Entity,
	EntityActionErrors,
	CustomField,
} from '~/types/entity.types';

type UpdateEntityProps = {
	type: EntityType;
	entity: Entity;
	isSubmitting?: boolean;
	isLoading?: boolean;
	errors?: EntityActionErrors;
};

export function UpdateEntityForm({
	type,
	entity,
	isSubmitting,
	isLoading,
	errors,
}: UpdateEntityProps) {
	const [customFields, setCustomFields] = React.useState<Array<CustomField>>(
		entity.custom ?? [],
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
			<Form method="post">
				<div>
					{informationFields.map((field) => (
						<FormField
							key={field.id}
							className="my-2"
							serverError={errors?.[field.name]}
							defaultValue={entity[field.name]}
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
								serverError={errors?.[field.name]}
								defaultValue={
									entity.address[field.name.replace('address-', '')]
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
									<Reorder.Item key={field.id} value={field}>
										<div className="my-2 flex items-center gap-2">
											<div className="mt-auto">
												<Button className="active:cursor-grab">
													<MoveIcon />
												</Button>
											</div>

											<input
												hidden
												readOnly
												name={`order-${field.id}`}
												value={index}
												className="hidden"
											/>

											<FormField
												id={`label-${field.id}`}
												label="Label"
												name={`label-${field.id}`}
												defaultValue={field.label}
												required
												className="flex-1"
												serverError={errors?.custom?.[index]?.label}
											/>

											<FormField
												id={`content-${field.id}`}
												label="Content"
												name={`content-${field.id}`}
												defaultValue={field.content}
												required
												className="flex-1"
												serverError={errors?.custom?.[index]?.content}
											/>

											<div className="mt-auto flex gap-2">
												<div className="flex items-center justify-center rounded-md px-4 py-2">
													<label
														htmlFor={`show-label-in-invoice-${field.id}`}
														className="sr-only"
													>
														Show label on invoice
													</label>
													<Switch
														id={`show-label-in-invoice-${field.id}`}
														name={`show-label-in-invoice-${field.id}`}
														defaultChecked={field.showLabelInInvoice}
													/>
												</div>
												<Button onClick={() => deleteField(field.id)}>
													<TrashIcon />
												</Button>
											</div>
										</div>
									</Reorder.Item>
								))}
							</Reorder.Group>
						</div>
					) : null}
				</div>

				<div>
					<Button disabled={isSubmitting} type="submit">
						{isLoading ? '...Updating' : 'Update'} {capitalize(type)}
					</Button>
				</div>
			</Form>
		</FormRoot>
	);
}
