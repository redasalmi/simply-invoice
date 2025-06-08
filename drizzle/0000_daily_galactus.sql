CREATE TABLE `addresses_table` (
	`address_id` text(26) PRIMARY KEY NOT NULL,
	`address1` text NOT NULL,
	`address2` text,
	`city` text,
	`country` text NOT NULL,
	`province` text,
	`zip` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE INDEX `address_city_index` ON `addresses_table` (`city`);--> statement-breakpoint
CREATE INDEX `address_country_index` ON `addresses_table` (`country`);--> statement-breakpoint
CREATE INDEX `address_province_index` ON `addresses_table` (`province`);--> statement-breakpoint
CREATE INDEX `address_zip_index` ON `addresses_table` (`zip`);--> statement-breakpoint
CREATE TABLE `companies_table` (
	`company_id` text(26) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`additional_information` text,
	`address_id` text(26) NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text,
	FOREIGN KEY (`address_id`) REFERENCES `addresses_table`(`address_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `company_name_index` ON `companies_table` (`name`);--> statement-breakpoint
CREATE INDEX `company_email_index` ON `companies_table` (`email`);--> statement-breakpoint
CREATE TABLE `customers_table` (
	`customer_id` text(26) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`additional_information` text,
	`address_id` text(26) NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text,
	FOREIGN KEY (`address_id`) REFERENCES `addresses_table`(`address_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `customer_name_index` ON `customers_table` (`name`);--> statement-breakpoint
CREATE INDEX `customer_email_index` ON `customers_table` (`email`);--> statement-breakpoint
CREATE TABLE `invoice_services_table` (
	`invoice_service_id` text(26) PRIMARY KEY NOT NULL,
	`invoice_id` text(26) NOT NULL,
	`service_id` text(26) NOT NULL,
	`quantity` real NOT NULL,
	`tax_id` text(26) NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices_table`(`invoice_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`service_id`) REFERENCES `services_table`(`service_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tax_id`) REFERENCES `taxes_table`(`tax_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `invoices_table` (
	`invoice_id` text(26) PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`identifier_type` text NOT NULL,
	`locale` text(4) NOT NULL,
	`country_code` text(2) NOT NULL,
	`date` text NOT NULL,
	`due_date` text,
	`company_id` text(26) NOT NULL,
	`customer_id` text(26) NOT NULL,
	`subtotal_amount` real NOT NULL,
	`total_amount` real NOT NULL,
	`note` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text,
	FOREIGN KEY (`company_id`) REFERENCES `companies_table`(`company_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_id`) REFERENCES `customers_table`(`customer_id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "identifier_type_check" CHECK(identifier_type IN ('incremental', 'random', 'manual'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invoices_table_identifier_unique` ON `invoices_table` (`identifier`);--> statement-breakpoint
CREATE INDEX `invoice_identifier_type_index` ON `invoices_table` (`identifier_type`);--> statement-breakpoint
CREATE INDEX `invoice_locale_index` ON `invoices_table` (`locale`);--> statement-breakpoint
CREATE INDEX `invoice_country_code_index` ON `invoices_table` (`country_code`);--> statement-breakpoint
CREATE INDEX `invoice_date_index` ON `invoices_table` (`date`);--> statement-breakpoint
CREATE INDEX `invoice_subtotal_amount_index` ON `invoices_table` (`subtotal_amount`);--> statement-breakpoint
CREATE INDEX `invoice_total_amount_index` ON `invoices_table` (`total_amount`);--> statement-breakpoint
CREATE TABLE `services_table` (
	`service_id` text(26) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`rate` real NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE INDEX `service_name_index` ON `services_table` (`name`);--> statement-breakpoint
CREATE INDEX `service_rate_index` ON `services_table` (`rate`);--> statement-breakpoint
CREATE TABLE `taxes_table` (
	`tax_id` text(26) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`rate` real NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE INDEX `tax_name_index` ON `taxes_table` (`name`);--> statement-breakpoint
CREATE INDEX `tax_rate_index` ON `taxes_table` (`rate`);--> statement-breakpoint
CREATE TABLE `users_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`email` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_email_unique` ON `users_table` (`email`);