import type { z } from 'zod';
import { ulid } from 'ulid';
import type {
	CreateEntitySchemaErrors,
	UpdateEntitySchemaErrors,
} from '~/schemas/entity.schemas';
import type { CustomField } from '~/types/entity.types';

export function parseCreateEntityForm(formData: FormData) {
	const entries = Array.from(formData);
	const today = new Date().toISOString();

	const entity = {
		id: ulid(),
		address: {
			id: ulid(),
		},
		createdAt: today,
		updatedAt: today,
	};

	const customFields: Record<string, CustomField> = {};

	entries.forEach(([key, value]) => {
		const entryValue = value.toString();

		if (key.search(/show-label-in-invoice|order|label|content/gi) > -1) {
			const id = key
				.replace('show-label-in-invoice-', '')
				.replace('order-', '')
				.replace('label-', '')
				.replace('content-', '');

			if (!customFields[id]) {
				customFields[id] = { id } as CustomField;
			}

			if (key === `order-${id}`) {
				customFields[id].order = parseInt(entryValue, 10);
			} else if (key === `label-${id}`) {
				customFields[id].label = entryValue;
			} else if (key === `content-${id}`) {
				customFields[id].content = entryValue;
			} else if (key === `show-label-in-invoice-${id}`) {
				customFields[id].showLabelInInvoice = entryValue === 'on';
			}
		} else if (key.search('address-') > -1) {
			entity.address[key.replace('address-', '')] = entryValue;
		} else {
			entity[key] = entryValue;
		}
	});

	if (Object.keys(customFields).length) {
		entity.custom = Object.values(customFields);
	}

	return entity;
}

export function parseUpdateEntityForm(entityId: string, formData: FormData) {
	const entries = Array.from(formData);
	const today = new Date().toISOString();

	const entity = {
		id: entityId,
		updatedAt: today,
	};

	const customFields: Record<string, CustomField> = {};

	entries.forEach(([key, value]) => {
		const entryValue = value.toString();

		if (key.search(/show-label-in-invoice|order|label|content/gi) > -1) {
			const id = key
				.replace('show-label-in-invoice-', '')
				.replace('order-', '')
				.replace('label-', '')
				.replace('content-', '');

			if (!customFields[id]) {
				customFields[id] = { id } as CustomField;
			}

			if (key === `order-${id}`) {
				customFields[id].order = parseInt(entryValue, 10);
			} else if (key === `label-${id}`) {
				customFields[id].label = entryValue;
			} else if (key === `content-${id}`) {
				customFields[id].content = entryValue;
			} else if (key === `show-label-in-invoice-${id}`) {
				customFields[id].showLabelInInvoice = entryValue === 'on';
			}
		} else if (key.search('address-') > -1) {
			entity[key.replace('address-', 'address.')] = entryValue;
		} else {
			entity[key] = entryValue;
		}
	});

	entity.custom = Object.values(customFields);

	return entity;
}

type CustomErrors = Record<string, { label?: string; content?: string }>;

type ActionErrors = {
	name?: string;
	email?: string;
	'address-address1'?: string;
	'address-country'?: string;
	custom?: CustomErrors;
};

export function parseCreateEntityErrors(err: z.ZodError) {
	const zodErrors: CreateEntitySchemaErrors = err.format();
	const customErrors: CustomErrors = {};

	if (zodErrors.custom) {
		for (const [key, value] of Object.entries(zodErrors.custom)) {
			if (key === '_errors') {
				continue;
			}

			if (!Array.isArray(value)) {
				customErrors[key] = {};
				if (value?.label?._errors?.[0]) {
					customErrors[key].label = value?.label?._errors?.[0];
				}

				if (value?.content?._errors?.[0]) {
					customErrors[key].content = value?.content?._errors?.[0];
				}
			}
		}
	}

	const errors: ActionErrors = {};
	if (zodErrors.name?._errors?.[0]) {
		errors.name = zodErrors.name._errors[0];
	}
	if (zodErrors.email?._errors?.[0]) {
		errors.email = zodErrors.email._errors[0];
	}
	if (zodErrors.address?.address1?._errors?.[0]) {
		errors['address-address1'] = zodErrors.address.address1._errors[0];
	}
	if (zodErrors.address?.country?._errors?.[0]) {
		errors['address-country'] = zodErrors.address.country._errors[0];
	}
	if (Object.keys(customErrors).length) {
		errors.custom = customErrors;
	}

	return errors;
}

export function parseUpdateEntityErrors(err: z.ZodError) {
	const zodErrors: UpdateEntitySchemaErrors = err.format();

	const errors: ActionErrors = {};
	const customErrors: CustomErrors = {};

	if (zodErrors.custom) {
		for (const [key, value] of Object.entries(zodErrors.custom)) {
			if (key === '_errors') {
				continue;
			}

			if (!Array.isArray(value)) {
				customErrors[key] = {};
				if (value?.label?._errors?.[0]) {
					customErrors[key].label = value?.label?._errors?.[0];
				}

				if (value?.content?._errors?.[0]) {
					customErrors[key].content = value?.content?._errors?.[0];
				}
			}
		}
	}

	if (zodErrors.name?._errors?.[0]) {
		errors.name = zodErrors.name._errors[0];
	}
	if (zodErrors.email?._errors?.[0]) {
		errors.email = zodErrors.email._errors[0];
	}
	if (zodErrors['address.address1']?._errors?.[0]) {
		errors['address-address1'] = zodErrors['address.address1']._errors[0];
	}
	if (zodErrors['address.country']?._errors?.[0]) {
		errors['address-country'] = zodErrors['address.country']._errors[0];
	}
	if (Object.keys(customErrors).length) {
		errors.custom = customErrors;
	}

	return errors;
}
