"use server";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { patients } from "@/server/db/schema";
import { CreatePatient, CreatePatientWithUserId, PatientSelect } from "@/types";

export async function getPatients(userId: string) {
  const response = await db
    .select()
    .from(patients)
    .where(eq(patients.user_id, userId));

  return response;
}

export async function createPatient(patient: CreatePatientWithUserId) {
  const response = await db.insert(patients).values(patient).returning();

  return response;
}
