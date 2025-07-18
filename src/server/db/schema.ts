import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTableAuth = pgTableCreator((name) => `auth_${name}`);

export const createTable = pgTableCreator((name) => `${name}`);

/*  ####################################### ENUMS ######################################  */

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

/*  ####################################### AUTH ######################################  */

export const users = createTableAuth("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

/*  ####################################### WEB APP ######################################  */

export const patients = createTable("patient", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  user_id: varchar("user_id", { length: 255 }).references(() => users.id, {
    onDelete: "cascade",
  }),
  anonymized_id: varchar("anonymized_id", { length: 255 })
    .unique()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  // name: varchar("name", { length: 255 }),
  // surname: varchar("surname", { length: 255 }),
  // date_of_birth: timestamp("date_of_birth", {
  //   mode: "date",
  //   withTimezone: true,
  // }),
  // gender: genderEnum("gender"),
  // email: varchar("email", { length: 255 }),
  // phone: varchar("phone", { length: 255 }),
  // address: varchar("address", { length: 255 }),
  notes: text("notes"),
  created_at: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
});
