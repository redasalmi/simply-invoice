CREATE TABLE `user_settings_table` (
	`setting_id` text(26) PRIMARY KEY NOT NULL,
	`setting_key` text NOT NULL,
	`setting_value` text NOT NULL,
	`setting_type` text DEFAULT 'string' NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text,
	CONSTRAINT "setting_type_check" CHECK(setting_type IN ('number', 'string', 'boolean', 'json'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_settings_table_setting_key_unique` ON `user_settings_table` (`setting_key`);--> statement-breakpoint
CREATE INDEX `setting_key_index` ON `user_settings_table` (`setting_key`);