"use server";
/**
 * DataAccess Layer - Raw HTTP requests to the backend API for assessments
 * This layer handles the actual network communication with the backend
 */

const API_PROCESSING_URL = process.env.NEXT_PUBLIC_API_PROCESSING_URL;

export async function getAssessmentsByUserId(
  userId: string
): Promise<Response> {
  const response = await fetch(`${API_PROCESSING_URL}/assessments/${userId}`, {
    method: "GET",
  });

  return response;
}
