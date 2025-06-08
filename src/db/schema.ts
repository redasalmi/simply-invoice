import { sql } from "drizzle-orm";
import { check, index, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { ulid } from "ulid";

const timestamps = {
	createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
	updatedAt: text("updated_at").$onUpdateFn(() => sql`(current_timestamp)`),
};

export const addressesTable = sqliteTable(
	"addresses_table",
	{
		addressId: text("address_id", { length: 26 })
			.primaryKey()
			.$defaultFn(() => ulid()),
		address1: text("address1").notNull(),
		address2: text("address2"),
		city: text("city"),
		country: text("country").notNull(),
		province: text("province"),
		zip: text("zip"),
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
		companyId: text("company_id", { length: 26 })
			.primaryKey()
			.$defaultFn(() => ulid()),
		name: text("name").notNull(),
		email: text("email").notNull(),
		additionalInformation: text("additional_information", { mode: "json" }),
		addressId: text("address_id", { length: 26 })
			.notNull()
			.references(() => addressesTable.addressId, { onDelete: "cascade" }),
		...timestamps,
	},
	(table) => [
		index("company_name_index").on(table.name),
		index("company_email_index").on(table.email),
	],
);

export const customersTable = sqliteTable(
	"customers_table",
	{
		customerId: text("customer_id", { length: 26 })
			.primaryKey()
			.$defaultFn(() => ulid()),
		name: text("name").notNull(),
		email: text("email").notNull(),
		additionalInformation: text("additional_information", { mode: "json" }),
		addressId: text("address_id", { length: 26 })
			.notNull()
			.references(() => addressesTable.addressId, { onDelete: "cascade" }),
		...timestamps,
	},
	(table) => [
		index("customer_name_index").on(table.name),
		index("customer_email_index").on(table.email),
	],
);

export const servicesTable = sqliteTable(
	"services_table",
	{
		serviceId: text("service_id", { length: 26 })
			.primaryKey()
			.$defaultFn(() => ulid()),
		name: text("name").notNull(),
		description: text("description"),
		rate: real("rate").notNull(),
		...timestamps,
	},
	(table) => [
		index("service_name_index").on(table.name),
		index("service_rate_index").on(table.rate),
	],
);

export const taxesTable = sqliteTable(
	"taxes_table",
	{
		taxId: text("tax_id", { length: 26 })
			.primaryKey()
			.$defaultFn(() => ulid()),
		name: text("name").notNull(),
		description: text("description"),
		rate: real("rate").notNull(),
		...timestamps,
	},
	(table) => [
		index("tax_name_index").on(table.name),
		index("tax_rate_index").on(table.rate),
	],
);

export const invoicesTable = sqliteTable(
	"invoices_table",
	{
		invoiceId: text("invoice_id", { length: 26 })
			.primaryKey()
			.$defaultFn(() => ulid()),
		identifier: text("identifier").notNull().unique(),
		identifierType: text("identifier_type").notNull(),
		locale: text("locale", { length: 4 }).notNull(),
		countryCode: text("country_code", { length: 2 }).notNull(),
		date: text("date").notNull(),
		dueDate: text("due_date"),
		companyId: text("company_id", { length: 26 })
			.notNull()
			.references(() => companiesTable.companyId),
		customerId: text("customer_id", { length: 26 })
			.notNull()
			.references(() => customersTable.customerId),
		subtotalAmount: real("subtotal_amount").notNull(),
		totalAmount: real("total_amount").notNull(),
		note: text("note", { mode: "json" }),
		...timestamps,
	},
	(table) => [
		check(
			"identifier_type_check",
			sql`identifier_type IN ('incremental', 'random', 'manual')`,
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
	invoiceServiceId: text("invoice_service_id", { length: 26 })
		.primaryKey()
		.$defaultFn(() => ulid()),
	invoiceId: text("invoice_id", { length: 26 })
		.notNull()
		.references(() => invoicesTable.invoiceId, { onDelete: "cascade" }),
	serviceId: text("service_id", { length: 26 })
		.notNull()
		.references(() => servicesTable.serviceId),
	quantity: real("quantity").notNull(),
	taxId: text("tax_id", { length: 26 })
		.notNull()
		.references(() => taxesTable.taxId),
	...timestamps,
});
