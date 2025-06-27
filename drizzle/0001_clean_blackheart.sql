DROP TABLE `users_table`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_addresses_table` (
	`address_id` text(26) PRIMARY KEY NOT NULL,
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
CREATE INDEX `address_zip_index` ON `addresses_table` (`zip`);