import { For, Show, createSignal } from 'solid-js';
import { action, redirect, useSubmission } from '@solidjs/router';
import { ulid } from 'ulid';
import { z } from 'zod';
import { Label } from '~/components/ui/Label';
import { Input } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { createCompany, getCompanyActionErrors } from '~/utils/company';
import { db } from '~/lib/db';

const createCompanyAction = action(async (formData: FormData) => {
	try {
		const company = createCompany(formData);
		await db.companies.add(company);

		throw redirect('/companies');
	} catch (err) {
		if (err instanceof z.ZodError) {
			const errors = getCompanyActionErrors<'create'>(err);

			return {
				errors,
			};
		}
	}
}, 'create-company');

export default function NewCompany() {
	const creatingCompany = useSubmission(createCompanyAction);
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
			<form action={createCompanyAction} method="post">
				<div>
					<div>
						<Label for="name">
							Name *{' '}
							{creatingCompany.result?.errors?.name ? (
								<span class="text-red-500">
									({creatingCompany.result.errors.name})
								</span>
							) : null}
						</Label>
						<Input type="text" id="name" name="name" />
					</div>
					<div>
						<Label for="email">
							Email *{' '}
							{creatingCompany.result?.errors?.email ? (
								<span class="text-red-500">
									({creatingCompany.result.errors.email})
								</span>
							) : null}
						</Label>
						<Input type="email" id="email" name="email" />
					</div>
				</div>

				<div>
					<h3 class="text-2xl">Address</h3>
					<div>
						<div>
							<Label for="address-address1">
								Address 1 *{' '}
								{creatingCompany.result?.errors?.address1 ? (
									<span class="text-red-500">
										({creatingCompany.result.errors.address1})
									</span>
								) : null}
							</Label>
							<Input
								type="text"
								id="address-address1"
								name="address-address1"
							/>
						</div>
						<div>
							<Label for="address-address2">Address 2</Label>
							<Input
								type="text"
								id="address-address2"
								name="address-address2"
							/>
						</div>
						<div>
							<Label for="address-country">
								Country *{' '}
								{creatingCompany.result?.errors?.country ? (
									<span class="text-red-500">
										({creatingCompany.result.errors.country})
									</span>
								) : null}
							</Label>
							<Input type="text" id="address-country" name="address-country" />
						</div>
						<div>
							<Label for="address-province">Province</Label>
							<Input
								type="text"
								id="address-province"
								name="address-province"
							/>
						</div>
						<div>
							<Label for="address-city">City</Label>
							<Input type="text" id="address-city" name="address-city" />
						</div>
						<div>
							<Label for="address-zip">Zip</Label>
							<Input type="text" id="address-zip" name="address-zip" />
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
										<Label for={`label-${field.id}`}>
											Label *{' '}
											{creatingCompany.result?.errors?.custom?.[index()]
												?.label ? (
												<span class="text-red-500">
													({creatingCompany.result.errors.custom[index()].label}
													)
												</span>
											) : null}
										</Label>
										<Input
											type="text"
											id={`label-${field.id}`}
											name={`label-${field.id}`}
										/>
									</div>
									<div>
										<Label for={`content-${field.id}`}>
											Content *{' '}
											{creatingCompany.result?.errors?.custom?.[index()]
												?.content ? (
												<span class="text-red-500">
													(
													{
														creatingCompany.result.errors.custom[index()]
															.content
													}
													)
												</span>
											) : null}
										</Label>
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
