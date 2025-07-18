/**
 * UseCase Layer - Business logic and validation for audio analysis
 * This layer handles business rules, validations, and orchestrates DataAccess
 */

import {
  AudioAnalysisApiError,
  createStatusEventSource,
  getAnalysisResultsByJobId,
  uploadForAnalysis,
} from "@/data-access/audio-analysis";
import { useAuth } from "@/hooks/useAuth";
import {
  AnalysisRequestSchema,
  StatusUpdateSchema,
  AnalysisRequestWithSegmentsSchema,
  AnalysisResultDataSchema,
} from "@/lib/zod";
import { getAuthSession } from "@/server/auth";
import {
  AnalysisResult,
  AudioAnalysisUseCaseError,
  ProcessingStep,
  StatusUpdate,
  ErrorCallback,
  AnalysisSegmentsOptions,
  AnalysisSegment,
  AnalysisMetadata,
  AnalysisResultData,
} from "@/types";
import { z } from "zod";

export type StatusCallback = (status: StatusUpdate) => void;
export type CompletedCallback = (result: AnalysisResult) => void;

export type AnalysisStartResult = {
  job_id: string;
  eventSource: EventSource;
};

// const SUPPORTED_AUDIO_EXTENSIONS = [
//   ".mp3",
//   ".wav",
//   ".ogg",
//   ".m4a",
//   ".aac",
//   ".flac",
//   ".wma",
// ];

// const SUPPORTED_VIDEO_EXTENSIONS = [
//   ".mp4",
//   ".avi",
//   ".mov",
//   ".mkv",
//   ".wmv",
//   ".flv",
//   ".webm",
// ];

/**
 * Start analysis process with comprehensive error handling
 */
export async function startAnalysisUseCase(
  file: File,
  parsedAnalysisSegments: AnalysisSegment[],
  metadata: AnalysisMetadata,
  callbacks: {
    onStatusUpdate?: StatusCallback;
    onError?: ErrorCallback;
    onCompleted?: CompletedCallback;
  }
): Promise<AnalysisStartResult> {
  // const { onStatusUpdate, onError, onCompleted } = callbacks;
  if (!metadata.user_id) {
    throw new AudioAnalysisUseCaseError(
      "User ID is required",
      "USER_ID_REQUIRED"
    );
  }

  try {
    callbacks.onStatusUpdate?.({
      status: "starting",
      message: "Uploading file to server...",
    });

    const formData = new FormData();
    formData.append("user_id", metadata.user_id);
    formData.append("upload", file);
    formData.append("metadata", JSON.stringify(metadata));

    // Add analysis segments to the request
    formData.append("segments", JSON.stringify(parsedAnalysisSegments));

    const response = await uploadForAnalysis(formData);

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: "Network error", message: errorText };
      }

      throw new AudioAnalysisApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    const data = await response.json();

    // Validate response data
    const validatedData = AnalysisRequestSchema.parse(data);

    // Start listening for status updates
    const eventSource = listenToStatusUpdates(validatedData.job_id, {
      onStatusUpdate: callbacks.onStatusUpdate,
      onError: callbacks.onError,
      onCompleted: callbacks.onCompleted,
    });

    return {
      job_id: validatedData.job_id,
      eventSource,
    };
  } catch (error) {
    if (error instanceof AudioAnalysisApiError) {
      throw error;
    }

    throw new AudioAnalysisApiError(
      `Failed to upload file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      undefined,
      error
    );
  }
}

export const getAnalysisResultsByJobIdUseCase = async (
  userId: string,
  jobId: string
): Promise<AnalysisResultData | null> => {
  try {
    const response = await getAnalysisResultsByJobId(userId, jobId);
    const data = await response.json();
    if (data.message === "Results not found.") {
      return null;
    }
    const parsedData = AnalysisResultDataSchema.parse(data);
    return parsedData;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Listen to Server-Sent Events for status updates
 */
export function listenToStatusUpdates(
  jobId: string,
  callbacks: {
    onStatusUpdate?: StatusCallback;
    onError?: ErrorCallback;
    onCompleted?: CompletedCallback;
  }
): EventSource {
  const { onStatusUpdate, onError, onCompleted } = callbacks;

  try {
    const eventSource = createStatusEventSource(jobId);

    eventSource.onmessage = (event) => {
      try {
        console.log("event data", JSON.parse(event.data));
        const update = StatusUpdateSchema.parse(JSON.parse(event.data));
        onStatusUpdate?.(update);

        // Handle completion
        if (update.status === "completed" && update.result) {
          const result: AnalysisResult = {
            job_id: jobId,
            filename: `assessment-${jobId}`,
            intelligibility_results: update.result.intelligibility_results,
            acoustic_results: update.result.acoustic_results,
            intelligibility_scores: update.result.intelligibility_scores,
          };

          onCompleted?.(result);
          eventSource.close();
        }

        // Handle errors
        if (update.status === "error") {
          const error = new AudioAnalysisUseCaseError(
            update.message || "Processing failed",
            "PROCESSING_ERROR"
          );
          onError?.(error);
          eventSource.close();
        }
      } catch (error) {
        console.log("error", error);
        eventSource.close();
        const useCaseError = handleError(error);
        onError?.(useCaseError);
      }
    };

    eventSource.onerror = () => {
      const error = new AudioAnalysisUseCaseError(
        "Connection to server was lost. Please refresh the page and try again.",
        "CONNECTION_ERROR",
        new Error("EventSource error")
      );
      onError?.(error);
      eventSource.close();
    };

    return eventSource;
  } catch (error) {
    const useCaseError = handleError(error);
    onError?.(useCaseError);
    throw useCaseError;
  }
}

/**
 * Handle and normalize errors
 */
export function handleError(error: unknown): AudioAnalysisUseCaseError {
  if (error instanceof AudioAnalysisUseCaseError) {
    return error;
  }

  if (error instanceof AudioAnalysisApiError) {
    return new AudioAnalysisUseCaseError(error.message, "API_ERROR", error);
  }

  if (error instanceof z.ZodError) {
    return new AudioAnalysisUseCaseError(
      `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
      "VALIDATION_ERROR",
      error as Error
    );
  }

  return new AudioAnalysisUseCaseError(
    error instanceof Error ? error.message : "An unexpected error occurred",
    "UNKNOWN_ERROR",
    error instanceof Error ? error : undefined
  );
}
