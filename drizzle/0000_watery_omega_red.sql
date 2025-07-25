CREATE TABLE IF NOT EXISTS "patient" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255),
	"anonymized_id" varchar(255) NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "patient_anonymized_id_unique" UNIQUE("anonymized_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255),
	CONSTRAINT "auth_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient" ADD CONSTRAINT "patient_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
