import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@/env/server";

const db = drizzle(env.PG_DATABASE_URL);

export default db;
