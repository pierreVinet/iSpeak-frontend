"use server";
/**
 * UseCase Layer - Business logic and validation for assessments
 * This layer handles business rules, validations, and orchestrates DataAccess
 */

import { getAuthSession } from "@/server/auth";
import { AnalysisResultData } from "@/types";
import { getAssessmentsByUserId } from "@/data-access/assessments";
import { AnalysisResultDataSchema, AnalysisResultsDataSchema } from "@/lib/zod";
import { z } from "zod";

/**
 * Get all assessments for the authenticated user
 */
export async function getAssessmentsUseCase(): Promise<AnalysisResultData[]> {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    const response = await getAssessmentsByUserId(session.user.id);

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: "Network error", message: errorText };
      }

      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();

    const validatedAssessments = AnalysisResultsDataSchema.parse(data);

    return validatedAssessments;
  } catch (error) {
    console.error(error);
    return [];
  }
}
