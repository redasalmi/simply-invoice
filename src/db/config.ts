import path from "node:path";
import { drizzle } from "drizzle-orm/libsql";
import { app } from "electron";

const isDev = process.env.NODE_ENV === "development";

// to be replaced with a proper path later for production database
// the db will be saved in a user's directory, the path will be saved in the app settings
const dbFile = isDev
	? "file:local.db"
	: `file:${path.join(app.getPath("exe"), "..", "local.db")}`;

export const db = drizzle(dbFile, { logger: isDev });
