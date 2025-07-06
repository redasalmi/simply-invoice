PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_settings_table` (
	`setting_id` text(26) PRIMARY KEY NOT NULL,
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
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `user_settings_table_setting_key_unique` ON `user_settings_table` (`setting_key`);--> statement-breakpoint
CREATE INDEX `setting_key_index` ON `user_settings_table` (`setting_key`);