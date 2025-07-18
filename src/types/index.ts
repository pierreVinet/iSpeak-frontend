import {
  ProcessingStepSchema,
  StatusUpdateSchema,
  AnalysisRequestSchema,
  AudioFileSchema,
  ApiErrorSchema,
  fileInfoFormSchema,
  TimeRangeSchema,
  AnalysisTypeSchema,
  AnalysisSegmentSchema,
  CreateAnalysisSegmentSchema,
  AnalysisSegmentsFormSchema,
  IntelligibilityResultSchema,
  AnalysisResultDataSchema,
  PatientSchema,
  CreatePatientSchema,
  PatientSelectSchema,
} from "@/lib/zod";
import { LucideIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import z from "zod";

// Types derived from schemas
export type AudioFile = z.infer<typeof AudioFileSchema>;
export type AnalysisRequest = z.infer<typeof AnalysisRequestSchema>;
export type StatusUpdate = z.infer<typeof StatusUpdateSchema>;
export type ProcessingStep = z.infer<typeof ProcessingStepSchema>;

export type ApiError = z.infer<typeof ApiErrorSchema>;

export type FormSessionSmallData = z.infer<typeof fileInfoFormSchema>;

export type PhonemeData = {
  phoneme: string;
  count: number;
};

export type TranscriptionReferenceData = {
  reference: string;
  transcription: string;
  correct: boolean;
};

export type TranscriptionReference = {
  id: string;
  title: string;
  data: TranscriptionReferenceData[];
};

export type SidebarNavigationItem = {
  title: string;
  icon: LucideIcon;
  url: string;
  disabled?: boolean;
};

export type UploadTabsNames = "file-info" | "audio-analysis" | "results";

export type FileUploadContext = {
  form: UseFormReturn<FormSessionSmallData>;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  activeTab: UploadTabsNames;
  setActiveTab: React.Dispatch<React.SetStateAction<UploadTabsNames>>;
  jobId: string | null;
  setJobId: React.Dispatch<React.SetStateAction<string | null>>;
  validationErrors: string[];
  state: UseAudioAnalysisState;
  startServerAnalysis: () => Promise<void>;
  listenToExistingJob: () => void;
  clearError: () => void;
  resetAnalysis: () => void;
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  analysisSegments: AnalysisSegment[];
  setAnalysisSegments: React.Dispatch<React.SetStateAction<AnalysisSegment[]>>;
};

export type ErrorCallback = (error: AudioAnalysisUseCaseError) => void;

export class AudioAnalysisUseCaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = "AudioAnalysisUseCaseError";
  }
}

export type AnalysisResult = {
  job_id: string;
  filename: string;
  intelligibility_results?: any;
  acoustic_results?: any;
  intelligibility_scores?: any;
};

export interface UseAudioAnalysisState {
  // Processing state
  isProcessing: boolean;
  isCompleted: boolean;
  currentStatus: string | null;
  processingSteps: ProcessingStep[];

  // Results
  result: AnalysisResult | null;

  // Error state
  error: AudioAnalysisUseCaseError | null;

  // Progress
  progress: number;
}

export interface WaveSurferProps {
  audioUrl: string;
  setError: (error: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
  error: string | null;
}

// Analysis segment types
export type TimeRange = {
  start: number;
  end: number;
};

export type RegionTimeRange = {
  regionId?: string;
} & TimeRange;

export type AnalysisType = z.infer<typeof AnalysisTypeSchema>;

export interface AnalysisSegment {
  id: string;
  name: string;
  type: AnalysisType;
  timeRange: RegionTimeRange;
  referenceData?: {
    words?: string[];
    sentences?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Component props for analysis components
export interface SelectRangeProps {
  selectedRange: RegionTimeRange;
  onRangeChange: (range: RegionTimeRange) => void;
  onAddAnalysis: (
    analysis: Omit<AnalysisSegment, "id" | "status" | "createdAt" | "updatedAt">
  ) => void;
  handleCancelRangeSelection: () => void;
  duration: number;
  segments: AnalysisSegment[];
}

export interface AnalysisSegmentsProps {
  segments: AnalysisSegment[];
  onDeleteSegment: (id: string) => void;
  onUpdateSegment: (id: string, updates: Partial<AnalysisSegment>) => void;
  selectedRange: RegionTimeRange | null;
  setSelectedRange: (range: RegionTimeRange) => void;
  onRangeChange: (range: RegionTimeRange) => void;
  onAddAnalysis: (
    analysis: Omit<AnalysisSegment, "id" | "status" | "createdAt" | "updatedAt">
  ) => void;
  handleCancelRangeSelection: () => void;
  duration: number;
}

// WaveSurfer with regions props
export interface WaveSurferWithRegionsProps extends WaveSurferProps {
  onRegionUpdate: (range: RegionTimeRange, duration: number) => void;
  selectedRange: RegionTimeRange | null;
  analysisSegments: AnalysisSegment[];
  setDuration: (duration: number) => void;
  duration: number;
}

export type AnalysisMetadata = {
  user_id: string | undefined;
  patient_id: string | undefined;
  date: string | undefined;
  duration: number;
};

// Type inference
export type FileInfoFormData = z.infer<typeof fileInfoFormSchema>;
export type TimeRangeData = z.infer<typeof TimeRangeSchema>;
export type AnalysisTypeData = z.infer<typeof AnalysisTypeSchema>;
export type AnalysisSegmentData = z.infer<typeof AnalysisSegmentSchema>;
export type CreateAnalysisSegmentData = z.infer<
  typeof CreateAnalysisSegmentSchema
>;
export type AnalysisSegmentsFormData = z.infer<
  typeof AnalysisSegmentsFormSchema
>;

export interface TimeInputProps {
  value: number; // Time in seconds
  onChange: (value: number) => void; // Changed to return seconds
  error?: string;
  disabled?: boolean;
  min?: number; // Min time in seconds
  max?: number; // Max time in seconds
}

export interface TabsAnalysisProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loadError: string;
  setLoadError: React.Dispatch<React.SetStateAction<string>>;
  selectedRange: RegionTimeRange | null;
  setSelectedRange: React.Dispatch<
    React.SetStateAction<RegionTimeRange | null>
  >;
}

export interface AddAnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRange: { start: number; end: number };
  duration: number;
  segments: AnalysisSegment[];
  onAddAnalysis: (analysis: {
    name: string;
    type: AnalysisType;
    timeRange: { start: number; end: number };
    referenceData?: {
      sentences: string[];
      words: string[];
    };
  }) => void;
}

export type AnalysisSegmentsOptions = {
  transcription: boolean;
  acoustic_analysis: boolean;
};

export type AnalysisResultData = z.infer<typeof AnalysisResultDataSchema>;

// Patient types
export type Patient = z.infer<typeof PatientSchema>;
export type CreatePatient = z.infer<typeof CreatePatientSchema>;
export type CreatePatientWithUserId = CreatePatient & {
  user_id: string;
};
export type PatientSelect = z.infer<typeof PatientSelectSchema>;
export type IntelligibilityResultData = z.infer<
  typeof IntelligibilityResultSchema
>;
