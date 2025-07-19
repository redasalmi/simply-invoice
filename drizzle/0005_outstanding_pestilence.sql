PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_addresses_table` (
	`address_id` text(36) PRIMARY KEY NOT NULL,
	`address1` text NOT NULL,
	`address2` text,
	`city` text NOT NULL,
	`country` text NOT NULL,
	`province` text,
	`zip` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
INSERT INTO `__new_addresses_table`("address_id", "address1", "address2", "city", "country", "province", "zip", "created_at", "updated_at") SELECT "address_id", "address1", "address2", "city", "country", "province", "zip", "created_at", "updated_at" FROM `addresses_table`;--> statement-breakpoint
DROP TABLE `addresses_table`;--> statement-breakpoint
ALTER TABLE `__new_addresses_table` RENAME TO `addresses_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `address_city_index` ON `addresses_table` (`city`);--> statement-breakpoint
CREATE INDEX `address_country_index` ON `addresses_table` (`country`);--> statement-breakpoint
CREATE INDEX `address_province_index` ON `addresses_table` (`province`);--> statement-breakpoint
CREATE INDEX `address_zip_index` ON `addresses_table` (`zip`);--> statement-breakpoint
CREATE TABLE `__new_companies_table` (
	`company_id` text(36) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`tax_id` text,
	`status` text DEFAULT 'active' NOT NULL,
	`additional_information` text,
	`address_id` text(36) NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text,
	FOREIGN KEY (`address_id`) REFERENCES `addresses_table`(`address_id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "company_status_check" CHECK(status IN ('active', 'inactive'))
);
--> statement-breakpoint
INSERT INTO `__new_companies_table`("company_id", "name", "email", "phone", "tax_id", "status", "additional_information", "address_id", "created_at", "updated_at") SELECT "company_id", "name", "email", "phone", "tax_id", "status", "additional_information", "address_id", "created_at", "updated_at" FROM `companies_table`;--> statement-breakpoint
DROP TABLE `companies_table`;--> statement-breakpoint
ALTER TABLE `__new_companies_table` RENAME TO `companies_table`;--> statement-breakpoint
CREATE INDEX `company_name_index` ON `companies_table` (`name`);--> statement-breakpoint
CREATE INDEX `company_email_index` ON `companies_table` (`email`);--> statement-breakpoint
CREATE TABLE `__new_customers_table` (
	`customer_id` text(36) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`tax_id` text,
	`status` text DEFAULT 'active' NOT NULL,
	`additional_information` text,
	`address_id` text(36) NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text,
	FOREIGN KEY (`address_id`) REFERENCES `addresses_table`(`address_id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "customer_status_check" CHECK(status IN ('active', 'inactive'))
);
--> statement-breakpoint
INSERT INTO `__new_customers_table`("customer_id", "name", "email", "phone", "tax_id", "status", "additional_information", "address_id", "created_at", "updated_at") SELECT "customer_id", "name", "email", "phone", "tax_id", "status", "additional_information", "address_id", "created_at", "updated_at" FROM `customers_table`;--> statement-breakpoint
DROP TABLE `customers_table`;--> statement-breakpoint
ALTER TABLE `__new_customers_table` RENAME TO `customers_table`;--> statement-breakpoint
CREATE INDEX `customer_name_index` ON `customers_table` (`name`);--> statement-breakpoint
CREATE INDEX `customer_email_index` ON `customers_table` (`email`);--> statement-breakpoint
CREATE TABLE `__new_invoice_services_table` (
	`invoice_service_id` text(36) PRIMARY KEY NOT NULL,
	`invoice_id` text(36) NOT NULL,
	`service_id` text(36) NOT NULL,
	`quantity` real NOT NULL,
	`tax_id` text(36) NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices_table`(`invoice_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`service_id`) REFERENCES `services_table`(`service_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tax_id`) REFERENCES `taxes_table`(`tax_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_invoice_services_table`("invoice_service_id", "invoice_id", "service_id", "quantity", "tax_id", "created_at", "updated_at") SELECT "invoice_service_id", "invoice_id", "service_id", "quantity", "tax_id", "created_at", "updated_at" FROM `invoice_services_table`;--> statement-breakpoint
DROP TABLE `invoice_services_table`;--> statement-breakpoint
ALTER TABLE `__new_invoice_services_table` RENAME TO `invoice_services_table`;--> statement-breakpoint
CREATE TABLE `__new_invoices_table` (
	`invoice_id` text(36) PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`identifier_type` text NOT NULL,
	`locale` text(4) NOT NULL,
	`country_code` text(2) NOT NULL,
	`date` text NOT NULL,
	`due_date` text,
	`company_id` text(36) NOT NULL,
	`customer_id` text(36) NOT NULL,
	`subtotal_amount` real NOT NULL,
	`total_amount` real NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`note` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text,
	FOREIGN KEY (`company_id`) REFERENCES `companies_table`(`company_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_id`) REFERENCES `customers_table`(`customer_id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "identifier_type_check" CHECK(identifier_type IN ('incremental', 'random', 'manual')),
	CONSTRAINT "invoice_status_check" CHECK(status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled'))
);
--> statement-breakpoint
INSERT INTO `__new_invoices_table`("invoice_id", "identifier", "identifier_type", "locale", "country_code", "date", "due_date", "company_id", "customer_id", "subtotal_amount", "total_amount", "status", "note", "created_at", "updated_at") SELECT "invoice_id", "identifier", "identifier_type", "locale", "country_code", "date", "due_date", "company_id", "customer_id", "subtotal_amount", "total_amount", "status", "note", "created_at", "updated_at" FROM `invoices_table`;--> statement-breakpoint
DROP TABLE `invoices_table`;--> statement-breakpoint
ALTER TABLE `__new_invoices_table` RENAME TO `invoices_table`;--> statement-breakpoint
CREATE UNIQUE INDEX `invoices_table_identifier_unique` ON `invoices_table` (`identifier`);--> statement-breakpoint
CREATE INDEX `invoice_identifier_type_index` ON `invoices_table` (`identifier_type`);--> statement-breakpoint
CREATE INDEX `invoice_locale_index` ON `invoices_table` (`locale`);--> statement-breakpoint
CREATE INDEX `invoice_country_code_index` ON `invoices_table` (`country_code`);--> statement-breakpoint
CREATE INDEX `invoice_date_index` ON `invoices_table` (`date`);--> statement-breakpoint
CREATE INDEX `invoice_subtotal_amount_index` ON `invoices_table` (`subtotal_amount`);--> statement-breakpoint
CREATE INDEX `invoice_total_amount_index` ON `invoices_table` (`total_amount`);--> statement-breakpoint
CREATE TABLE `__new_services_table` (
	`service_id` text(36) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`rate` real NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text,
	CONSTRAINT "service_status_check" CHECK(status IN ('active', 'inactive'))
);
--> statement-breakpoint
INSERT INTO `__new_services_table`("service_id", "name", "description", "rate", "status", "created_at", "updated_at") SELECT "service_id", "name", "description", "rate", "status", "created_at", "updated_at" FROM `services_table`;--> statement-breakpoint
DROP TABLE `services_table`;--> statement-breakpoint
ALTER TABLE `__new_services_table` RENAME TO `services_table`;--> statement-breakpoint
CREATE INDEX `service_name_index` ON `services_table` (`name`);--> statement-breakpoint
CREATE INDEX `service_rate_index` ON `services_table` (`rate`);--> statement-breakpoint
CREATE TABLE `__new_taxes_table` (
	`tax_id` text(36) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`rate` real NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`type` text DEFAULT 'percentage' NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text,
	CONSTRAINT "tax_status_check" CHECK(status IN ('active', 'inactive')),
	CONSTRAINT "tax_type_check" CHECK(type IN ('percentage', 'fixed_amount'))
);
--> statement-breakpoint
INSERT INTO `__new_taxes_table`("tax_id", "name", "description", "rate", "status", "type", "created_at", "updated_at") SELECT "tax_id", "name", "description", "rate", "status", "type", "created_at", "updated_at" FROM `taxes_table`;--> statement-breakpoint
DROP TABLE `taxes_table`;--> statement-breakpoint
ALTER TABLE `__new_taxes_table` RENAME TO `taxes_table`;--> statement-breakpoint
CREATE INDEX `tax_name_index` ON `taxes_table` (`name`);--> statement-breakpoint
CREATE INDEX `tax_rate_index` ON `taxes_table` (`rate`);--> statement-breakpoint
CREATE TABLE `__new_user_settings_table` (
	`setting_id` text(36) PRIMARY KEY NOT NULL,
	`setting_key` text NOT NULL,
	`setting_value` text NOT NULL,
	`setting_type` text DEFAULT 'string' NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text,
	CONSTRAINT "setting_key_check" CHECK(setting_key IN ('companies-table-items-per-page', 'customers-table-items-per-page', 'services-table-items-per-page', 'taxes-table-items-per-page', 'invoices-table-items-per-page')),
	CONSTRAINT "setting_type_check" CHECK(setting_type IN ('number', 'string', 'boolean', 'json'))
);
--> statement-breakpoint
INSERT INTO `__new_user_settings_table`("setting_id", "setting_key", "setting_value", "setting_type", "created_at", "updated_at") SELECT "setting_id", "setting_key", "setting_value", "setting_type", "created_at", "updated_at" FROM `user_settings_table`;--> statement-breakpoint
DROP TABLE `user_settings_table`;--> statement-breakpoint
ALTER TABLE `__new_user_settings_table` RENAME TO `user_settings_table`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_settings_table_setting_key_unique` ON `user_settings_table` (`setting_key`);--> statement-breakpoint
CREATE INDEX `setting_key_index` ON `user_settings_table` (`setting_key`);