import * as React from 'react';
import { Form } from '@remix-run/react';
import { ulid } from 'ulid';
import { Reorder } from 'framer-motion';
import { Input } from '~/components/ui/input';
import { NewFormField } from '~/components/NewFormField';
import { Button } from '~/components/ui/button';
import { addressFields, informationFields } from '~/lib/constants';
import { capitalize } from '~/utils/shared';
import type { EntityActionErrors, EntityType } from '~/lib/types';

type CreateEntityProps = {
	type: EntityType;
	isSubmitting?: boolean;
	isLoading?: boolean;
	errors?: EntityActionErrors;
};

export function CreateEntity({
	type,
	isSubmitting,
	isLoading,
	errors,
}: CreateEntityProps) {
	const [customFields, setCustomFields] = React.useState<Array<{ id: string }>>(
		[],
	);

	const addField = () => {
		setCustomFields((prevFields) => prevFields.concat({ id: ulid() }));
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
					<NewFormField
						key={field.id}
						className="my-2"
						error={errors?.[field.name]}
						{...field}
					/>
				))}
			</div>

			<div>
				<h3 className="text-2xl">Address</h3>
				<div>
					{addressFields.map((field) => (
						<NewFormField
							key={field.id}
							className="my-2"
							error={errors?.[field.name]}
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
										<Input
											name={`order-${field.id}`}
											readOnly
											aria-hidden
											tabIndex={-1}
											value={index}
											className="hidden"
										/>

										<NewFormField
											id={`label-${field.id}`}
											name={`label-${field.id}`}
											label="Label *"
											required
											className="flex-1"
											error={errors?.custom?.[index]?.label}
										/>

										<NewFormField
											id={`content-${field.id}`}
											name={`content-${field.id}`}
											label="Content *"
											required
											className="flex-1"
											error={errors?.custom?.[index]?.content}
										/>

										<div className="mt-auto flex gap-2">
											<Button>Show Label In Invoice</Button>
											<Button>Reorder</Button>
											<Button onClick={() => deleteField(field.id)}>
												Delete Custom Field
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
					{isLoading ? '...Saving' : 'Save'} {capitalize(type)}
				</Button>
			</div>
		</Form>
	);
}
