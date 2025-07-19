import type { PortableTextBlock } from "@portabletext/editor";
import { relations, sql } from "drizzle-orm";
import {
	check,
	customType,
	index,
	real,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";
import { v7 as uuidv7 } from "uuid";

const timestamps = {
	createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
	updatedAt: text("updated_at").$onUpdateFn(() => sql`(current_timestamp)`),
};

const customJson = <T>(name: string) =>
	customType<{ data: T | null; driverData: string | null }>({
		dataType() {
			return "text";
		},
		toDriver(value: T | null): string | null {
			if (!value) {
				return null;
			}

			return JSON.stringify(value);
		},
		fromDriver(value: string | null): T | null {
			if (!value) {
				return null;
			}

			try {
				return JSON.parse(value);
			} catch {
				return null;
			}
		},
	})(name);

export const addressesTable = sqliteTable(
	"addresses_table",
	{
		addressId: text("address_id", { length: 36 })
			.primaryKey()
			.$defaultFn(() => uuidv7()),
		address1: text("address1").notNull(),
		address2: text("address2"),
		city: text("city").notNull(),
		country: text("country").notNull(),
		province: text("province"),
		zip: text("zip").notNull(),
		...timestamps,
	},
	(table) => [
		index("address_city_index").on(table.city),
		index("address_country_index").on(table.country),
		index("address_province_index").on(table.province),
		index("address_zip_index").on(table.zip),
	],
);

export const companiesTable = sqliteTable(
	"companies_table",
	{
		companyId: text("company_id", { length: 36 })
			.primaryKey()
			.$defaultFn(() => uuidv7()),
		name: text("name").notNull(),
		email: text("email").notNull(),
		phone: text("phone"),
		taxId: text("tax_id"),
		status: text("status", { enum: ["active", "inactive"] })
			.notNull()
			.default("active"),
		additionalInformation: customJson<Array<PortableTextBlock>>(
			"additional_information",
		),
		addressId: text("address_id", { length: 36 })
			.notNull()
			.references(() => addressesTable.addressId, { onDelete: "cascade" }),
		...timestamps,
	},
	(table) => [
		check("company_status_check", sql`status IN ('active', 'inactive')`),
		index("company_name_index").on(table.name),
		index("company_email_index").on(table.email),
	],
);

export const companiesRelations = relations(companiesTable, ({ one }) => ({
	address: one(addressesTable, {
		fields: [companiesTable.addressId],
		references: [addressesTable.addressId],
	}),
}));

export const customersTable = sqliteTable(
	"customers_table",
	{
		customerId: text("customer_id", { length: 36 })
			.primaryKey()
			.$defaultFn(() => uuidv7()),
		name: text("name").notNull(),
		email: text("email").notNull(),
		phone: text("phone"),
		taxId: text("tax_id"),
		status: text("status", { enum: ["active", "inactive"] })
			.notNull()
			.default("active"),
		additionalInformation: customJson<Array<PortableTextBlock>>(
			"additional_information",
		),
		addressId: text("address_id", { length: 36 })
			.notNull()
			.references(() => addressesTable.addressId, { onDelete: "cascade" }),
		...timestamps,
	},
	(table) => [
		check("customer_status_check", sql`status IN ('active', 'inactive')`),
		index("customer_name_index").on(table.name),
		index("customer_email_index").on(table.email),
	],
);

export const customersRelations = relations(customersTable, ({ one }) => ({
	address: one(addressesTable, {
		fields: [customersTable.addressId],
		references: [addressesTable.addressId],
	}),
}));

export const servicesTable = sqliteTable(
	"services_table",
	{
		serviceId: text("service_id", { length: 36 })
			.primaryKey()
			.$defaultFn(() => uuidv7()),
		name: text("name").notNull(),
		description: text("description"),
		rate: real("rate").notNull(),
		status: text("status", { enum: ["active", "inactive"] })
			.notNull()
			.default("active"),
		...timestamps,
	},
	(table) => [
		check("service_status_check", sql`status IN ('active', 'inactive')`),
		index("service_name_index").on(table.name),
		index("service_rate_index").on(table.rate),
	],
);

export const taxesTable = sqliteTable(
	"taxes_table",
	{
		taxId: text("tax_id", { length: 36 })
			.primaryKey()
			.$defaultFn(() => uuidv7()),
		name: text("name").notNull(),
		description: text("description"),
		rate: real("rate").notNull(),
		status: text("status", { enum: ["active", "inactive"] })
			.notNull()
			.default("active"),
		type: text("type", { enum: ["percentage", "fixed_amount"] })
			.notNull()
			.default("percentage"),
		...timestamps,
	},
	(table) => [
		check("tax_status_check", sql`status IN ('active', 'inactive')`),
		check("tax_type_check", sql`type IN ('percentage', 'fixed_amount')`),
		index("tax_name_index").on(table.name),
		index("tax_rate_index").on(table.rate),
	],
);

export const invoicesTable = sqliteTable(
	"invoices_table",
	{
		invoiceId: text("invoice_id", { length: 36 })
			.primaryKey()
			.$defaultFn(() => uuidv7()),
		identifier: text("identifier").notNull().unique(),
		identifierType: text("identifier_type", {
			enum: ["incremental", "random", "manual"],
		}).notNull(),
		locale: text("locale", { length: 4 }).notNull(),
		countryCode: text("country_code", { length: 2 }).notNull(),
		date: text("date").notNull(),
		dueDate: text("due_date"),
		companyId: text("company_id", { length: 36 })
			.notNull()
			.references(() => companiesTable.companyId),
		customerId: text("customer_id", { length: 36 })
			.notNull()
			.references(() => customersTable.customerId),
		subtotalAmount: real("subtotal_amount").notNull(),
		totalAmount: real("total_amount").notNull(),
		status: text("status", {
			enum: ["draft", "sent", "paid", "overdue", "cancelled"],
		})
			.notNull()
			.default("draft"),
		note: text("note", { mode: "json" }),
		...timestamps,
	},
	(table) => [
		check(
			"identifier_type_check",
			sql`identifier_type IN ('incremental', 'random', 'manual')`,
		),
		check(
			"invoice_status_check",
			sql`status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')`,
		),
		index("invoice_identifier_type_index").on(table.identifierType),
		index("invoice_locale_index").on(table.locale),
		index("invoice_country_code_index").on(table.countryCode),
		index("invoice_date_index").on(table.date),
		index("invoice_subtotal_amount_index").on(table.subtotalAmount),
		index("invoice_total_amount_index").on(table.totalAmount),
	],
);

export const invoiceServicesTable = sqliteTable("invoice_services_table", {
	invoiceServiceId: text("invoice_service_id", { length: 36 })
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	invoiceId: text("invoice_id", { length: 36 })
		.notNull()
		.references(() => invoicesTable.invoiceId, { onDelete: "cascade" }),
	serviceId: text("service_id", { length: 36 })
		.notNull()
		.references(() => servicesTable.serviceId),
	quantity: real("quantity").notNull(),
	taxId: text("tax_id", { length: 36 })
		.notNull()
		.references(() => taxesTable.taxId),
	...timestamps,
});

export const userSettingsTable = sqliteTable(
	"user_settings_table",
	{
		settingId: text("setting_id", { length: 36 })
			.primaryKey()
			.$defaultFn(() => uuidv7()),
		settingKey: text("setting_key", {
			enum: [
				"companies-table-items-per-page",
				"customers-table-items-per-page",
				"services-table-items-per-page",
				"taxes-table-items-per-page",
				"invoices-table-items-per-page",
			],
		})
			.notNull()
			.unique(),
		settingValue: text("setting_value").notNull(),
		settingType: text("setting_type", {
			enum: ["number", "string", "boolean", "json"],
		})
			.notNull()
			.default("string"),
		...timestamps,
	},
	(table) => [
		check(
			"setting_key_check",
			sql`setting_key IN ('companies-table-items-per-page', 'customers-table-items-per-page', 'services-table-items-per-page', 'taxes-table-items-per-page', 'invoices-table-items-per-page')`,
		),
		check(
			"setting_type_check",
			sql`setting_type IN ('number', 'string', 'boolean', 'json')`,
		),
		index("setting_key_index").on(table.settingKey),
	],
);
