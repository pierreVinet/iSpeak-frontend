"use client";
import {
  AnalysisRequestWithSegmentsSchema,
  AudioFileSchema,
  fileInfoFormSchema,
} from "@/lib/zod";
import {
  AnalysisResult,
  AudioAnalysisUseCaseError,
  FileUploadContext,
  ProcessingStep,
  StatusUpdate,
  UploadTabsNames,
  UseAudioAnalysisState,
  ErrorCallback,
  AnalysisSegment,
  FormSessionSmallData,
} from "@/types";
import {
  AnalysisStartResult,
  CompletedCallback,
  listenToStatusUpdates,
  startAnalysisUseCase,
} from "@/use-cases/audio-analysis";
import { StatusCallback } from "@/use-cases/audio-analysis";
import { healthCheck } from "@/data-access/audio-analysis";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSegmentsOptions, mapStatusToProcessingSteps } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";

const FileUpload = createContext<FileUploadContext | null>(null);

const FileUploadProvider = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = useState<number>(1);
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<UploadTabsNames>("file-info");
  const [jobId, setJobId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [duration, setDuration] = useState<number>(0);
  const [analysisSegments, setAnalysisSegments] = useState<AnalysisSegment[]>(
    []
  );
  const [editingSegment, setEditingSegment] = useState<AnalysisSegment | null>(
    null
  );

  // Wavesurfer instance sharing
  const [wavesurferInstance, setWavesurferInstance] = useState<any | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const form = useForm<FormSessionSmallData>({
    resolver: zodResolver(fileInfoFormSchema),
    defaultValues: {
      // notes: "",
      date: new Date(),
      patient_id: undefined,
    },
  });
  const { user } = useAuth();

  // Processing State of the File on the server
  const [state, setState] = useState<UseAudioAnalysisState>({
    isProcessing: false,
    isCompleted: false,
    currentStatus: null,
    processingSteps: [],
    result: null,
    error: null,
    progress: 0,
  });

  // Track the current EventSource to allow cleanup
  const eventSourceRef = useRef<EventSource | null>(null);

  // Calculate progress based on processing steps
  const calculateProgress = useCallback((steps: ProcessingStep[]): number => {
    if (steps.length === 0) return 0;

    const completedSteps = steps.filter(
      (step) => step.status === "completed"
    ).length;
    const processingSteps = steps.filter(
      (step) => step.status === "processing"
    ).length;

    // Give processing steps 30% credit
    const progressSteps = completedSteps + processingSteps * 0.3;

    return Math.round((progressSteps / steps.length) * 100);
  }, []);

  const segmentsOptions = useMemo(
    () => getSegmentsOptions(analysisSegments),
    [analysisSegments]
  );

  // Status update callback
  const handleStatusUpdate: StatusCallback = useCallback(
    (statusUpdate: StatusUpdate) => {
      const processingSteps = mapStatusToProcessingSteps(
        statusUpdate.status,
        segmentsOptions
      );
      const progress = calculateProgress(processingSteps);

      setState((prev) => ({
        ...prev,
        currentStatus: statusUpdate.status,
        processingSteps,
        progress,
        error: null, // Clear any previous errors
      }));
    },
    [calculateProgress, analysisSegments]
  );

  // Error callback
  const handleError: ErrorCallback = useCallback(
    (error: AudioAnalysisUseCaseError) => {
      setState((prev) => ({
        ...prev,
        isProcessing: false,
        error,
        // Update processing steps to show error state
        processingSteps: prev.processingSteps.map((step) =>
          step.status === "processing"
            ? { ...step, status: "error" as const }
            : step
        ),
      }));

      // Clean up EventSource
      cleanup();
    },
    []
  );

  // Completion callback
  const handleCompleted: CompletedCallback = useCallback(
    (result: AnalysisResult) => {
      setState((prev) => ({
        ...prev,
        isProcessing: false,
        isCompleted: true,
        result,
        progress: 100,
      }));

      // Clean up EventSource
      cleanup();
    },
    []
  );

  const startServerAnalysis = useCallback(async () => {
    // Reset state
    setState((prev) => ({
      ...prev,
      isProcessing: true,
      isCompleted: false,
      currentStatus: null,
      processingSteps: [],
      result: null,
      error: null,
      progress: 0,
    }));
    // Clean up any existing EventSource
    cleanup();

    // Validate file before starting analysis
    const validatedFile = AudioFileSchema.safeParse({ file });
    if (!validatedFile.success) {
      setValidationErrors(
        validatedFile.error.errors.map((error) => error.message)
      );
      return;
    }

    // server health check
    try {
      handleStatusUpdate({
        status: "starting",
        message: "Checking server connection...",
      });
      const response = await healthCheck();
      if (!response.ok) {
        handleError(
          new AudioAnalysisUseCaseError(
            "Server connection failed.",
            "CONNECTION_ERROR"
          )
        );
        return;
      }
      handleStatusUpdate({
        status: "uploading",
        message: "Uploading file...",
      });
    } catch (error) {
      handleError(
        new AudioAnalysisUseCaseError(
          "Server connection failed. Please retry.",
          "CONNECTION_ERROR",
          error instanceof Error ? error : undefined
        )
      );
      return;
    }

    const { segments: parsedSegments } =
      AnalysisRequestWithSegmentsSchema.parse({
        segments: analysisSegments,
      });

    console.log("parsedSegments", parsedSegments);

    try {
      // Start the analysis process
      const result: AnalysisStartResult = await startAnalysisUseCase(
        validatedFile.data.file,
        parsedSegments,
        {
          user_id: user?.id,
          patient_id: form.getValues("patient_id"),
          date: form.getValues("date")?.toISOString(),
          duration: duration,
        },
        {
          onStatusUpdate: handleStatusUpdate,
          onError: handleError,
          onCompleted: handleCompleted,
        }
      );

      // Notify parent component with the job ID
      setJobId(result.job_id);

      // Store the EventSource reference for cleanup
      eventSourceRef.current = result.eventSource;
    } catch (error) {
      // Error is already handled by the error callback
      console.error("Analysis start error:", error);
    }
  }, [
    handleStatusUpdate,
    handleError,
    handleCompleted,
    file,
    analysisSegments,
  ]);

  // Listen to existing job without starting new analysis
  const listenToExistingJob = useCallback(() => {
    if (!jobId) return;

    // Reset state for listening to existing job
    setState((prev) => ({
      ...prev,
      isProcessing: true,
      isCompleted: false,
      currentStatus: null,
      processingSteps: [],
      result: null,
      error: null,
      progress: 0,
    }));

    // Clean up any existing EventSource
    cleanup();

    try {
      // Start listening to the existing job
      const eventSource = listenToStatusUpdates(jobId, {
        onStatusUpdate: handleStatusUpdate,
        onError: handleError,
        onCompleted: handleCompleted,
      });

      eventSourceRef.current = eventSource;
    } catch (error) {
      console.error("Failed to listen to existing job:", error);
      handleError(
        new AudioAnalysisUseCaseError(
          "Failed to connect to existing job",
          "CONNECTION_ERROR",
          error instanceof Error ? error : undefined
        )
      );
    }
  }, [handleStatusUpdate, handleError, handleCompleted, jobId]);

  const resetAnalysis = useCallback(() => {
    // Clean up EventSource
    cleanup();

    setFile(null);
    setJobId(null);
    setAnalysisSegments([]);
    setValidationErrors([]);
    setEditingSegment(null);
    setStep(1);
    setActiveTab("file-info");
    form.reset();

    setState({
      isProcessing: false,
      isCompleted: false,
      currentStatus: null,
      processingSteps: [],
      result: null,
      error: null,
      progress: 0,
    });
    setDuration(0);

    // Reset audio state
    setWavesurferInstance(null);
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  // // Cleanup on unmount
  const cleanup = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  return (
    <FileUpload.Provider
      value={{
        form,
        step,
        setStep,
        file,
        setFile,
        activeTab,
        setActiveTab,
        jobId,
        setJobId,
        validationErrors,
        startServerAnalysis,
        listenToExistingJob,
        clearError,
        state,
        resetAnalysis,
        duration,
        setDuration,
        analysisSegments,
        setAnalysisSegments,
        editingSegment,
        setEditingSegment,
        wavesurferInstance,
        setWavesurferInstance,
        isPlaying,
        setIsPlaying,
        currentTime,
        setCurrentTime,
      }}
    >
      {children}
    </FileUpload.Provider>
  );
};

export const useFileUpload = () => {
  const fileContext = useContext(FileUpload);
  if (!fileContext) {
    throw new Error("useFileUpload must be used within a FileUploadProvider.");
  }
  return fileContext;
};

export default FileUploadProvider;
