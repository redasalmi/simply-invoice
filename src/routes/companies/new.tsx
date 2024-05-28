import { For, Show, createSignal } from 'solid-js';
import { action, redirect, useSubmission } from '@solidjs/router';
import { ulid } from 'ulid';
import { Label } from '~/components/ui/Label';
import { Input } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { db } from '~/lib/db';
import type { Company } from '~/lib/types';

const createCompany = action(async (formData: FormData) => {
	const name = formData.get('name');
	const email = formData.get('email');
	const address1 = formData.get('address1');
	const address2 = formData.get('address2');
	const country = formData.get('country');
	const province = formData.get('province');
	const city = formData.get('city');
	const zip = formData.get('zip');

	const today = new Date().toISOString();
	const company: Company = {
		id: ulid(),
		name,
		email,
		address: {
			id: ulid(),
			address1,
			address2,
			country,
			province,
			city,
			zip,
		},
		createdAt: today,
		updatedAt: today,
	};

	await db.companies.add(company);

	throw redirect('/companies');
}, 'create-company');

export default function NewCompany() {
	const creatingCompany = useSubmission(createCompany);
	const [customFields, setCustomFields] = createSignal<Array<{ id: string }>>(
		[],
	);

	const AddCustomField = () => {
		setCustomFields((prevCustomFields) => [
			...prevCustomFields,
			{ id: ulid() },
		]);
	};

	const deleteCustomField = (id: string) => {
		setCustomFields((prevCustomFields) =>
			prevCustomFields.filter((field) => field.id !== id),
		);
	};

	return (
		<section>
			<form action={createCompany} method="post">
				<div>
					<div>
						<Label for="name">Name *</Label>
						<Input id="name" type="text" name="name" required />
					</div>
					<div>
						<Label for="email">Email *</Label>
						<Input id="email" type="email" name="email" required />
					</div>
				</div>

				<div>
					<h3 class="text-2xl">Address</h3>
					<div>
						<div>
							<Label for="address1">Address 1 *</Label>
							<Input id="address1" type="text" name="address1" required />
						</div>
						<div>
							<Label for="address2">Address 2</Label>
							<Input id="address2" type="text" name="address2" />
						</div>
						<div>
							<Label for="country">Country *</Label>
							<Input id="country" type="text" name="country" required />
						</div>
						<div>
							<Label for="province">Province</Label>
							<Input id="province" type="text" name="province" />
						</div>
						<div>
							<Label for="city">City</Label>
							<Input id="city" type="text" name="city" />
						</div>
						<div>
							<Label for="zip">Zip</Label>
							<Input id="zip" type="text" name="zip" />
						</div>
					</div>
				</div>

				<div>
					<div class="flex items-center justify-between">
						<div>
							<h3 class="text-2xl">Custom Fields</h3>
							<p class="mb-2 block text-sm">
								Add any custom fields and order them
							</p>
						</div>
						<div>
							<Button type="button" onClick={AddCustomField}>
								Add New Field
							</Button>
						</div>
					</div>

					<Show when={customFields().length > 0}>
						<For each={customFields()}>
							{(field, index) => (
								<div class="flex gap-4">
									<Input
										type="text"
										readOnly
										aria-hidden
										tabIndex={-1}
										name={`order-${field.id}`}
										value={index()}
										class="hidden"
									/>
									<div>
										<Label for={`label-${field.id}`}>Label *</Label>
										<Input
											type="text"
											id={`label-${field.id}`}
											name={`label-${field.id}`}
										/>
									</div>
									<div>
										<Label for={`content-${field.id}`}>Content *</Label>
										<Input
											type="text"
											id={`content-${field.id}`}
											name={`content-${field.id}`}
										/>
									</div>
									<div class="flex gap-2">
										<Button type="button">Show In invoice</Button>
										<Button type="button">Reorder</Button>
										<Button
											type="button"
											onClick={() => deleteCustomField(field.id)}
										>
											Delete
										</Button>
									</div>
								</div>
							)}
						</For>
					</Show>
				</div>

				<div class="mt-8">
					<Button type="submit" disabled={creatingCompany.pending}>
						{creatingCompany.pending ? '...Saving Company' : 'Save Company'}
					</Button>
				</div>
			</form>
		</section>
	);
}
