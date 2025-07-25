DO $$ BEGIN
 ALTER TABLE "patient" DROP CONSTRAINT "patient_anonymized_id_unique";
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS  "user_anonymized_id_unique" ON "patient" USING btree ("user_id","anonymized_id");