/**
 * DataAccess Layer - Raw HTTP requests to the backend API
 * This layer handles the actual network communication with the backend
 */

const API_PROCESSING_URL = process.env.NEXT_PUBLIC_API_PROCESSING_URL;

export class AudioAnalysisApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = "AudioAnalysisApiError";
  }
}

export async function uploadForAnalysis(formData: FormData): Promise<Response> {
  const response = await fetch(`${API_PROCESSING_URL}/analyze`, {
    method: "POST",
    body: formData,
  });

  return response;
}

export async function getAnalysisResultsByJobId(
  userId: string,
  jobId: string
): Promise<Response> {
  const response = await fetch(
    `${API_PROCESSING_URL}/results/${userId}/${jobId}`
  );
  return response;
}

/**
 * Create EventSource for Server-Sent Events
 */
export function createStatusEventSource(jobId: string): EventSource {
  const url = `${API_PROCESSING_URL}/status/${jobId}`;
  return new EventSource(url);
}

/**
 * Check if the API is reachable
 */
export async function healthCheck(): Promise<Response> {
  const response = await fetch(`${API_PROCESSING_URL}/`, {
    method: "GET",
    timeout: 5000,
  } as any);

  return response;
}
