import * as React from 'react';
import { Form } from '@remix-run/react';
import { ulid } from 'ulid';
import { Reorder } from 'framer-motion';
import { MoveIcon, TrashIcon } from 'lucide-react';
import { Input } from '~/components/ui/input';
import { FormField } from '~/components/ui/form-field';
import { Button } from '~/components/ui/button';
import { Switch } from '~/components/ui/switch';
import { addressFields, informationFields } from '~/lib/constants';
import { capitalize } from '~/utils/shared.utils';
import type {
	EntityType,
	Entity,
	EntityActionErrors,
} from '~/types/entity.types';
import type { CustomField } from '~/types/formField.types';

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
		<Form method="post">
			<div>
				{informationFields.map((field) => (
					<FormField
						id={field.id}
						key={field.id}
						className="my-2"
						error={errors?.[field.name]}
						label={field.label}
						input={{
							...field.input,
							defaultValue: entity[field.input.name],
						}}
					/>
				))}
			</div>

			<div>
				<h3 className="text-2xl">Address</h3>
				<div>
					{addressFields.map((field) => (
						<FormField
							id={field.id}
							key={field.id}
							className="my-2"
							error={errors?.[field.name]}
							label={field.label}
							input={{
								...field.input,
								defaultValue:
									entity.address[field.input.name.replace('address-', '')],
							}}
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
						<Button onPress={addField}>Add New Custom Field</Button>
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

										<Input
											name={`order-${field.id}`}
											readOnly
											aria-hidden
											tabIndex={-1}
											value={index}
											className="hidden"
										/>

										<FormField
											id={`label-${field.id}`}
											label={{ children: 'Label *' }}
											input={{
												name: `label-${field.id}`,
												required: true,
												defaultValue: field.label,
											}}
											className="flex-1"
											error={errors?.custom?.[index]?.label}
										/>

										<FormField
											id={`content-${field.id}`}
											label={{ children: 'Content *' }}
											input={{
												name: `content-${field.id}`,
												required: true,
												defaultValue: field.content,
											}}
											className="flex-1"
											error={errors?.custom?.[index]?.content}
										/>

										<div className="mt-auto flex gap-2">
											<div className="flex items-center justify-center rounded-md bg-primary px-4 py-2">
												<Switch
													name={`show-label-in-invoice-${field.id}`}
													checked={field.showLabelInInvoice}
												/>
											</div>
											<Button onPress={() => deleteField(field.id)}>
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
				<Button isDisabled={isSubmitting} type="submit">
					{isLoading ? '...Updating' : 'Update'} {capitalize(type)}
				</Button>
			</div>
		</Form>
	);
}
