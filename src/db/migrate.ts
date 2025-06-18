import path from "node:path";
import { db } from "@db/config";
import { migrate } from "drizzle-orm/libsql/migrator";
import { app } from "electron";

const isDev = process.env.NODE_ENV === "development";

export async function migrateDb() {
	try {
		const migrationsFolder = isDev
			? "./drizzle"
			: path.join(app.getPath("exe"), "..", "resources", "drizzle");
		await migrate(db, { migrationsFolder });
	} catch (err) {
		console.error("Error migrating database:", err);
	}
}
