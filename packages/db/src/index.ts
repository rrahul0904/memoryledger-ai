import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
export * from "./schema";
export function createDatabase(url: string) {
  const client = postgres(url, {max: 10, prepare: false});
  return { client, db: drizzle(client) };
}
