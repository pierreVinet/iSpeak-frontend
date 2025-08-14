import {
  AnalysisResultData,
  AnalysisSegment,
  AnalysisSegmentsOptions,
  IntelligibilityResultData,
  PhonemeData,
  ProcessingStep,
  TimeRange,
  TranscriptionReference,
} from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Clamps a value between a minimum and maximum value
 * @param value - The value to clamp
 * @param min - The minimum allowed value
 * @param max - The maximum allowed value
 * @returns The clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Clamps a percentage value between 0 and 100
 * @param value - The percentage value to clamp
 * @returns The clamped percentage value
 */
export function clampPercentage(value: number): number {
  return clamp(value, 0, 100);
}

/**
 * Formats time in seconds to MM:SS or HH:MM:SS format
 * @param seconds - Time in seconds
 * @param prettify - Whether to display with "h", "min", "s" labels
 * @returns Formatted time string (MM:SS, HH:MM:SS, or prettified format)
 */
export function formatTime(seconds: number, prettify: boolean = false): string {
  if (!seconds || isNaN(seconds) || seconds < 0)
    return prettify ? "0s" : "00:00";

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (prettify) {
    if (hours > 0) {
      return `${hours}h ${mins}min ${secs}s`;
    } else if (mins > 0) {
      return `${mins}min ${secs}s`;
    } else {
      return `${secs}s`;
    }
  } else {
    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    } else {
      return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
  }
}

/**
 * Parses time string in MM:SS format to seconds
 * @param timeStr - Time string in MM:SS format
 * @returns Time in seconds
 */
export function parseTime(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(":");
  if (parts.length !== 2) return 0;
  const mins = parseInt(parts[0], 10) || 0;
  const secs = parseInt(parts[1], 10) || 0;
  return mins * 60 + secs;
}

/**
 * Generates a unique UUID
 * @returns A unique string ID
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * Convert seconds to Date object for MUI TimeField
 * @param seconds - Time in seconds
 * @returns Date object
 */
export const getTimeValueFromSeconds = (seconds: number): Date => {
  const date = new Date();
  date.setHours(0, 0, 0, 0); // Reset to midnight
  date.setSeconds(seconds);
  return date;
};

/**
 * Validate time against min and max
 * @param seconds Time in seconds
 * @param min Minimum time in seconds
 * @param max Maximum time in seconds
 * @returns True if the time is valid, false otherwise
 */
export const validateTimeMinMax = (
  seconds: number,
  min?: number,
  max?: number
): boolean => {
  if (min !== undefined && seconds < min) return false;
  if (max !== undefined && seconds > max) return false;
  return true;
};

/**
 * Validate time range
 * @param selectedRange - The selected range
 * @param duration - The duration of the audio file
 * @returns True if the time range is valid, false otherwise
 */
export const validateTimeRange: (
  selectedRange: TimeRange,
  duration: number
) => string | null = (selectedRange, duration) => {
  if (selectedRange.start < 0) {
    return "Start time cannot be negative";
  } else if (selectedRange.start > duration) {
    return `Start time cannot exceed session duration (${formatTime(
      duration
    )})`;
  } else if (selectedRange.end > duration) {
    return `End time cannot exceed session duration (${formatTime(duration)})`;
  } else if (selectedRange.start >= selectedRange.end) {
    return "Start time must be less than end time";
  }
  return null;
};

// Parsing functions
export const parseIntelligibilityWords = (input: string): string[] => {
  if (!input?.trim()) return [];
  return input
    .split(",")
    .map((word) => word.trim())
    .filter((word) => word.length > 0);
};

export const parseIntelligibilitySentences = (input: string): string[] => {
  if (!input?.trim()) return [];

  let sentences: string[] = [];

  // Split by line breaks first
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  // Regex pattern to match sentence-ending punctuation
  const sentenceEndingPattern = /[.!?]+/;

  // For each line, check if it contains sentence-ending punctuation and split further
  for (const line of lines) {
    if (sentenceEndingPattern.test(line)) {
      // Split by sentence-ending punctuation within the line
      const punctuationSeparated = line
        .split(sentenceEndingPattern)
        .map((sentence) => sentence.trim())
        .filter((sentence) => sentence.length > 0);
      sentences.push(...punctuationSeparated);
    } else {
      // No sentence-ending punctuation, treat the whole line as one sentence
      sentences.push(line);
    }
  }

  // If no line breaks were found, fall back to sentence-ending punctuation separation
  if (lines.length === 1 && !input.includes("\n")) {
    sentences = input
      .split(sentenceEndingPattern)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0);
  }

  return sentences;
};

export const getSegmentsOptions = (
  analysisSegments: AnalysisSegment[]
): AnalysisSegmentsOptions => {
  let transcription = false;
  let acoustic_analysis = false;

  for (const segment of analysisSegments) {
    if (segment.type === "acoustic") {
      acoustic_analysis = true;
    }
    if (segment.type === "intelligibility") {
      transcription = true;
    }
  }

  return {
    transcription,
    acoustic_analysis,
  };
};

/**
 * Convert status updates to processing steps for UI
 */
export function mapStatusToProcessingSteps(
  currentStatus: string,
  segmentsOptions: AnalysisSegmentsOptions
): ProcessingStep[] {
  const steps: ProcessingStep[] = [
    {
      id: "health_check",
      name: "Server Connection",
      description: "Connecting to the server",
      status: "pending",
    },
    {
      id: "upload",
      name: "Uploading File",
      description: "Securely uploading your file to our servers",
      status: "pending",
    },
    {
      id: "convert",
      name: "Audio Conversion",
      description: "Converting audio to optimal format",
      status: "pending",
    },
  ];

  if (segmentsOptions.transcription) {
    steps.push({
      id: "transcribe",
      name: "Speech Recognition",
      description: "Converting speech to text using AI",
      status: "pending",
    });
  }
  if (segmentsOptions.acoustic_analysis) {
    steps.push({
      id: "analyze",
      name: "Audio Analysis",
      description: "Analyzing audio characteristics and patterns",
      status: "pending",
    });
  }

  steps.push({
    id: "finalize",
    name: "Finalizing Results",
    description: "Preparing your analysis results",
    status: "pending",
  });

  // Helper function to mark step as processing and all previous as completed
  const markStepAsProcessing = (stepId: string) => {
    const stepIndex = steps.findIndex((step) => step.id === stepId);
    if (stepIndex >= 0) {
      // Mark all previous steps as completed
      for (let i = 0; i < stepIndex; i++) {
        steps[i].status = "completed";
      }
      // Mark current step as processing
      steps[stepIndex].status = "processing";
    }
  };

  // Helper function to mark step as completed and all previous as completed
  const markStepAsCompleted = (stepId: string) => {
    const stepIndex = steps.findIndex((step) => step.id === stepId);
    if (stepIndex >= 0) {
      // Mark all previous steps and current step as completed
      for (let i = 0; i <= stepIndex; i++) {
        steps[i].status = "completed";
      }
    }
  };

  // Update step statuses based on current status
  switch (currentStatus) {
    case "starting":
      markStepAsProcessing("health_check");
      break;
    case "uploading":
      markStepAsCompleted("health_check");
      markStepAsProcessing("upload");
      break;
    case "upload_completed":
      markStepAsCompleted("upload");
      break;
    case "converting":
      markStepAsCompleted("upload");
      markStepAsProcessing("convert");
      break;
    case "converted":
      markStepAsCompleted("convert");
      break;
    case "transcribing":
      markStepAsCompleted("convert");
      if (segmentsOptions.transcription) {
        markStepAsProcessing("transcribe");
      }
      break;
    case "transcribed":
      markStepAsCompleted("convert");
      if (segmentsOptions.transcription) {
        markStepAsCompleted("transcribe");
      }
      break;
    case "acoustic_analysis":
      markStepAsCompleted("convert");
      if (segmentsOptions.transcription) {
        markStepAsCompleted("transcribe");
      }
      if (segmentsOptions.acoustic_analysis) {
        markStepAsProcessing("analyze");
      }
      break;
    case "acoustic_analysis_completed":
      markStepAsCompleted("convert");
      if (segmentsOptions.transcription) {
        markStepAsCompleted("transcribe");
      }
      if (segmentsOptions.acoustic_analysis) {
        markStepAsCompleted("analyze");
      }
      break;
    case "completed":
      steps.forEach((step) => (step.status = "completed"));
      break;
    case "error":
      // Find the current processing step and mark it as error
      const processingStep = steps.find((step) => step.status === "processing");
      if (processingStep) {
        processingStep.status = "error";
      }
      break;
  }

  return steps;
}

export const isCorrectFromWER = (wer: number): boolean => {
  return wer === 0;
};

export const getScoreColor = (score: number) => {
  if (score >= 75) return "var(--score-good)";
  if (score >= 25) return "var(--score-fair)";
  return "var(--score-poor)";
};

export const getScoreLabel = (score: number) => {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 50) return "Fair";
  if (score >= 25) return "Poor";
  return "Very Poor";
};

/**
 * Formats a UUID string for display by returning the characters before the first hyphen
 * @param uuid - The UUID string to format
 * @returns The formatted UUID string or the original string if not a UUID
 */
export function formatUUID(uuid: string): string {
  // UUID regex pattern
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (uuidPattern.test(uuid)) {
    return uuid.split("-")[0];
  }

  return uuid;
}

// Helper function to group assessments by month and year
export function groupAssessmentsByMonth(assessments: AnalysisResultData[]) {
  const groups: { [key: string]: AnalysisResultData[] } = {};

  assessments.forEach((assessment) => {
    const date = assessment.metadata.date;
    if (!date) {
      // Group assessments without dates under a special key
      const key = "no-date";
      if (!groups[key]) groups[key] = [];
      groups[key].push(assessment);
      return;
    }

    const assessmentDate = new Date(date);
    const monthYear = `${assessmentDate.getFullYear()}-${String(
      assessmentDate.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(assessment);
  });

  // Sort groups by date (newest first)
  const sortedKeys = Object.keys(groups)
    .filter((key) => key !== "no-date")
    .sort((a, b) => b.localeCompare(a));
  if (groups["no-date"]) {
    sortedKeys.push("no-date");
  }

  return sortedKeys.map((key) => ({
    key,
    monthYear: key === "no-date" ? "No Date" : formatMonthYear(key),
    assessments: groups[key],
  }));
}

function formatMonthYear(monthYear: string): string {
  if (monthYear === "no-date") return "No Date";

  const [year, month] = monthYear.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

export const formatDate = (dateString: string | null) => {
  if (!dateString) return "No date";

  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function transformToUIReferenceHypothesis(
  intelligibilityResult: IntelligibilityResultData
): TranscriptionReference {
  if (intelligibilityResult.intelligibility_type === "words") {
    const data = intelligibilityResult.metrics.alignments_fda2[0].map(
      (word) => ({
        reference: word.reference_words,
        transcription: word.hypothesis_words,
        correct: isCorrectFromWER(word.wer),
      })
    );

    return {
      id: intelligibilityResult.segment_id,
      title: intelligibilityResult.segment_name,
      data,
    };
  } else if (intelligibilityResult.intelligibility_type === "sentences") {
    const data = intelligibilityResult.metrics.alignments_fda2.map(
      (sentence) => ({
        reference: sentence.reference,
        transcription: sentence.hypothesis,
        correct: isCorrectFromWER(sentence.wer),
      })
    );

    return {
      id: intelligibilityResult.segment_id,
      title: intelligibilityResult.segment_name,
      data,
    };
  }

  return {
    id: "",
    title: "",
    data: [],
  };
}

// Extract phonemic data from assessment results
export const extractMisspelledPhonemicData = (
  assessment: AnalysisResultData
): {
  sortedData: PhonemeData[];
  maxMisspellings: number;
  colorCategories: number[];
  totalPhonemes: number;
} => {
  const phonemeCounts: Record<string, number> = {};

  // Extract phonemic data from all intelligibility results
  const int_results_values = Object.values(
    assessment.intelligibility_results || {}
  );

  for (const result of int_results_values) {
    const phonemicAnalysis = result.metrics?.phonemic_analysis;
    if (phonemicAnalysis) {
      // Count error phonemes from the unique_error_phonemes list
      for (const phoneme of phonemicAnalysis.unique_error_phonemes) {
        phonemeCounts[phoneme] =
          (phonemeCounts[phoneme] || 0) +
          phonemicAnalysis.incorrectly_transcribed_phonemes.filter(
            (p) => p === phoneme
          ).length;
      }
    }
  }
  const sortedData = Object.entries(phonemeCounts)
    .map(([phoneme, count]) => ({ phoneme, count }))
    .sort((a, b) => b.count - a.count);

  const maxMisspellings = Math.max(...sortedData.map((item) => item.count));

  // Create color categories based on misspelling counts
  const uniqueCounts = [...new Set(sortedData.map((item) => item.count))].sort(
    (a, b) => b - a
  );
  const colorCategories = sortedData.map((item) => {
    const categoryIndex = uniqueCounts.indexOf(item.count);
    return Math.min(categoryIndex, 4); // Cap at 4 (5 categories: 0-4)
  });

  // Convert to PhonemeData array and sort by misspelling count
  return {
    sortedData,
    maxMisspellings,
    colorCategories,
    totalPhonemes: sortedData.length,
  };
};

// Extract correctly spelled phonemic data from assessment results
export const extractCorrectPhonemicData = (
  assessment: AnalysisResultData
): {
  sortedData: PhonemeData[];
  maxCorrect: number;
  totalPhonemes: number;
} => {
  const phonemeCounts: Record<string, number> = {};

  // Extract phonemic data from all intelligibility results
  const int_results_values = Object.values(
    assessment.intelligibility_results || {}
  );

  for (const result of int_results_values) {
    const phonemicAnalysis = result.metrics?.phonemic_analysis;
    if (phonemicAnalysis) {
      // Count correct phonemes from the unique_correct_phonemes list
      for (const phoneme of phonemicAnalysis.unique_correct_phonemes) {
        phonemeCounts[phoneme] =
          (phonemeCounts[phoneme] || 0) +
          phonemicAnalysis.correctly_transcribed_phonemes.filter(
            (p) => p === phoneme
          ).length;
      }
    }
  }

  const sortedData = Object.entries(phonemeCounts)
    .map(([phoneme, count]) => ({ phoneme, count }))
    .sort((a, b) => b.count - a.count);

  const maxCorrect = Math.max(...sortedData.map((item) => item.count), 0);

  return {
    sortedData,
    maxCorrect,
    totalPhonemes: sortedData.length,
  };
};
