CREATE TABLE `sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`start_time` integer NOT NULL,
	`end_time` integer,
	`duration_seconds` integer NOT NULL,
	`focus_minutes` integer NOT NULL,
	`completed` integer DEFAULT false,
	`created_at` integer
);
