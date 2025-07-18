"use server";

import { createPatient, getPatients } from "@/data-access/patients";
import { getAuthSession } from "@/server/auth";
import { CreatePatient } from "@/types";
import { revalidatePath } from "next/cache";

export const getPatientsUseCase = async () => {
  const session = await getAuthSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const patients = await getPatients(userId);
    return patients;
  } catch (error) {
    console.error("Error fetching patients:", error);
    return [];
  }
};

export const createPatientUseCase = async (patient: CreatePatient) => {
  const session = await getAuthSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const newPatients = await createPatient({
      ...patient,
      user_id: userId,
    });

    const newPatientSelect = newPatients.map((pat) => ({
      id: pat.id,
      anonymized_id: pat.anonymized_id,
    }));
    revalidatePath("/dashboard/sessions/upload");

    return newPatientSelect[0];
  } catch (error) {
    console.error("Error creating patient:", error);
    return null;
  }
};
