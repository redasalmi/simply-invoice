import { createInsertSchema } from "drizzle-valibot";
import * as v from "valibot";
import {
	addressesTable,
	companiesTable,
	customersTable,
	servicesTable,
	taxesTable,
	userSettingsTable,
} from "~/db/schema";

// address schemas
export const addressCreateSchema = createInsertSchema(addressesTable, {
	address1: (schema) => v.pipe(schema, v.nonEmpty("Address 1 is required")),
	city: (schema) => v.pipe(schema, v.nonEmpty("City is required")),
	country: (schema) => v.pipe(schema, v.nonEmpty("Country is required")),
	zip: (schema) => v.pipe(schema, v.nonEmpty("Zip is required")),
});

export const addressUpdateSchema = v.object({
	...addressCreateSchema.entries,
	addressId: v.pipe(v.string(), v.nonEmpty("Address ID is required"), v.uuid()),
});

// company schemas
export const companyCreateWithAddressSchema = v.omit(
	createInsertSchema(companiesTable, {
		name: (schema) => v.pipe(schema, v.nonEmpty("Name is required")),
		email: (schema) =>
			v.pipe(
				schema,
				v.nonEmpty("Email is required"),
				v.email("Invalid email address"),
			),
	}),
	["addressId"],
);

export const companyUpdateWithAddressSchema = v.object({
	...companyCreateWithAddressSchema.entries,
	companyId: v.pipe(v.string(), v.nonEmpty("Company ID is required"), v.uuid()),
});

export const companyDeleteSchema = v.pipe(
	v.string(),
	v.nonEmpty("Company ID is required"),
	v.uuid(),
);

// customer schemas
export const customerCreateWithAddressSchema = v.omit(
	createInsertSchema(customersTable, {
		name: (schema) => v.pipe(schema, v.nonEmpty("Name is required")),
		email: (schema) =>
			v.pipe(
				schema,
				v.nonEmpty("Email is required"),
				v.email("Invalid email address"),
			),
	}),
	["addressId"],
);

export const customerUpdateWithAddressSchema = v.object({
	...customerCreateWithAddressSchema.entries,
	customerId: v.pipe(
		v.string(),
		v.nonEmpty("Customer ID is required"),
		v.uuid(),
	),
});

export const customerDeleteSchema = v.pipe(
	v.string(),
	v.nonEmpty("Customer ID is required"),
	v.uuid(),
);

// service schemas
export const serviceCreateSchema = createInsertSchema(servicesTable, {
	name: (schema) => v.pipe(schema, v.nonEmpty("Name is required")),
	rate: v.pipe(
		v.string(),
		v.nonEmpty("Rate is required"),
		v.decimal("Rate must be a number"),
		v.transform(Number),
		v.minValue(0, "Rate must be greater than 0"),
	),
});

export const serviceUpdateSchema = v.object({
	...serviceCreateSchema.entries,
	serviceId: v.pipe(v.string(), v.nonEmpty("Service ID is required"), v.uuid()),
});

export const serviceDeleteSchema = v.pipe(
	v.string(),
	v.nonEmpty("Service ID is required"),
	v.uuid(),
);

// tax schemas
export const taxCreateSchema = createInsertSchema(taxesTable, {
	name: (schema) => v.pipe(schema, v.nonEmpty("Name is required")),
	rate: v.pipe(
		v.string(),
		v.nonEmpty("Rate is required"),
		v.decimal("Rate must be a number"),
		v.transform(Number),
		v.minValue(0, "Rate must be greater than 0"),
	),
});

export const taxUpdateSchema = v.object({
	...taxCreateSchema.entries,
	taxId: v.pipe(v.string(), v.nonEmpty("Tax ID is required"), v.uuid()),
});

export const taxDeleteSchema = v.pipe(
	v.string(),
	v.nonEmpty("Tax ID is required"),
	v.uuid(),
);

// user settings schemas
export const userSettingUpdateSchema = createInsertSchema(userSettingsTable, {
	settingKey: (schema) => v.pipe(schema, v.nonEmpty("Setting key is required")),
	settingValue: (schema) =>
		v.pipe(schema, v.nonEmpty("Setting value is required")),
	settingType: (schema) =>
		v.pipe(schema, v.nonEmpty("Setting type is required")),
});
