import {
  integer,
  pgTable,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey(),
  username: varchar({ length: 255 }).notNull(),
  approved: boolean().notNull().default(false),
  signedUpAt: timestamp({ mode: "date" }).defaultNow(),
  scopes: varchar({ length: 255 }).array().notNull().default([]),
});
