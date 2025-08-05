import z from "zod";

export const fileInfoFormSchema = z.object({
  date: z.date(),
  patient_id: z.string().min(1, "Select or create a patient"),
  // notes: z.string().optional(),
});

// File validation schema
export const AudioFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, "File cannot be empty")
    // .refine(
    //   (file) => file.size <= 100 * 1024 * 1024,
    //   "File size must be less than 100MB"
    // )
    .refine(
      (file) =>
        file.type.startsWith("audio/") ||
        file.type.startsWith("video/") ||
        file.type === "application/octet-stream",
      "File must be an audio or video file"
    ),
});

// Analysis request schema
export const AnalysisRequestSchema = z.object({
  job_id: z.string().uuid(),
  status: z.string(),
  filename: z.string(),
});

// Status update schema for SSE
export const StatusUpdateSchema = z.object({
  status: z.enum([
    "starting",
    "uploading",
    "upload_completed",
    "converting",
    "converted",
    "transcribing",
    "trimming",
    "transcribed",
    "acoustic_analysis",
    "acoustic_analysis_completed",
    "completed",
    "error",
  ]),
  message: z.string(),
  result: z
    .object({
      intelligibility_results: z.any().optional(),
      acoustic_results: z.any().optional(),
      intelligibility_scores: z.any().optional(),
    })
    .optional(),
});

// Processing step schema
export const ProcessingStepSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.enum(["pending", "processing", "completed", "error"]),
});

// Error schema for API responses
export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  details: z.any().optional(),
});

// Analysis segment schemas
export const TimeRangeSchema = z
  .object({
    start: z.number().min(0),
    end: z.number().min(0),
  })
  .refine((data) => data.end > data.start, {
    message: "End time must be greater than start time",
    path: ["end"],
  });

export const AnalysisTypeSchema = z.enum(["acoustic", "intelligibility"]);

export const ReferenceDataSchema = z
  .object({
    words: z.array(z.string()).optional(),
    sentences: z.array(z.string()).optional(),
  })
  .optional();

export const AnalysisSegmentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Analysis name is required"),
  type: AnalysisTypeSchema,
  timeRange: TimeRangeSchema,
  referenceData: ReferenceDataSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Analysis segments formData schema for API requests
export const AnalysisRequestWithSegmentsSchema = z.object({
  segments: z.array(AnalysisSegmentSchema),
});

// Form schemas
export const CreateAnalysisSegmentSchema = z.object({
  name: z.string().min(1, "Analysis name is required"),
  type: AnalysisTypeSchema,
  timeRange: TimeRangeSchema,
  referenceData: ReferenceDataSchema,
});

export const AnalysisSegmentsFormSchema = z.object({
  segments: z.array(AnalysisSegmentSchema),
});

export const formAnalysisModalSchema = z
  .object({
    name: z.string().min(1, "Analysis name is required"),
    type: z.enum(["acoustic", "intelligibility"] as const),
    referenceType: z.enum(["words", "sentences"] as const),
    referenceWords: z.string().optional(),
    referenceSentences: z.string().optional(),
  })
  .refine(
    (data) => {
      // If type is intelligibility and referenceType is words, require referenceWords
      if (data.type === "intelligibility" && data.referenceType === "words") {
        return data.referenceWords && data.referenceWords.trim().length > 0;
      }
      return true;
    },
    {
      message: "Reference words are required for intelligibility analysis",
      path: ["referenceWords"],
    }
  )
  .refine(
    (data) => {
      // If type is intelligibility and referenceType is sentences, require referenceSentences
      if (
        data.type === "intelligibility" &&
        data.referenceType === "sentences"
      ) {
        return (
          data.referenceSentences && data.referenceSentences.trim().length > 0
        );
      }
      return true;
    },
    {
      message: "Reference sentences are required for intelligibility analysis",
      path: ["referenceSentences"],
    }
  );

// Schemas for analysis results from the backend

// Phonemic analysis schema
export const PhonemicAnalysisSchema = z.object({
  total_phonemes: z.number(),
  correctly_transcribed_phonemes: z.array(z.string()),
  incorrectly_transcribed_phonemes: z.array(z.string()),
  phoneme_error_mappings: z.record(z.record(z.number())),
  phoneme_accuracy: z.number(),
  phoneme_error_count: z.number(),
  unique_error_phonemes: z.array(z.string()),
  unique_correct_phonemes: z.array(z.string()),
});

// For intelligibility_type: "words"
export const WordAlignmentSchema = z.object({
  type: z.enum(["equal", "substitute", "insert", "delete"]),
  wer: z.number(),
  reference_words: z.string(),
  hypothesis_words: z.string(),
});

export const WordsMetricsSchema = z.object({
  wer: z.number(),
  visualize_alignment: z.string(),
  alignments_fda2: z.array(z.array(WordAlignmentSchema)),
  cer: z.number(),
  phonemic_analysis: PhonemicAnalysisSchema,
});

// For intelligibility_type: "sentences"
export const SentenceInnerAlignmentSchema = z.object({
  index: z.number(),
  type: z.enum(["equal", "insert", "substitute", "delete"]),
  ref_words: z.array(z.string()),
  hyp_words: z.array(z.string()),
  ref_text: z.string(),
  hyp_text: z.string(),
});

export const SentenceAlignmentSchema = z.object({
  reference: z.string(),
  hypothesis: z.string(),
  wer: z.number(),
  alignments: z.array(z.array(SentenceInnerAlignmentSchema)),
});

export const SentencesMetricsSchema = z.object({
  wer: z.number(),
  visualize_alignment: z.string(),
  alignments_fda2: z.array(SentenceAlignmentSchema),
  phonemic_analysis: PhonemicAnalysisSchema,
});

const BaseIntelligibilityResultSchema = z.object({
  segment_id: z.string().uuid(),
  segment_name: z.string(),
  segment_type: z.literal("intelligibility"),
  time_range: TimeRangeSchema,
  transcription: z.string(),
  normalized_transcription: z.string(),
});

const WordsIntelligibilityResultSchema = BaseIntelligibilityResultSchema.extend(
  {
    intelligibility_type: z.literal("words"),
    reference: z.string(),
    normalized_reference: z.string(),
    metrics: WordsMetricsSchema,
  }
);

const SentencesIntelligibilityResultSchema =
  BaseIntelligibilityResultSchema.extend({
    intelligibility_type: z.literal("sentences"),
    reference: z.array(z.string()),
    normalized_reference: z.array(z.string()),
    metrics: SentencesMetricsSchema,
  });

export const IntelligibilityResultSchema = z.discriminatedUnion(
  "intelligibility_type",
  [WordsIntelligibilityResultSchema, SentencesIntelligibilityResultSchema]
);

export const IntelligibilityScoresSchema = z.object({
  total_wer: z.number().nullable(),
  sentences_wer: z.number().nullable(),
  words_wer: z.number().nullable(),
});

export const MetadataSchema = z.object({
  job_id: z.string().uuid(),
  date: z.string().nullable(),
  duration: z.number(),
  patient_id: z.string().nullable(),
  user_id: z.string().nullable(),
  analysis_types: z.array(AnalysisTypeSchema),
});

// Acoustic analysis schemas

// Time series schemas
export const FundamentalFrequencyTimeSeriesSchema = z.object({
  time: z.array(z.number()),
  frequency: z.array(z.number()),
});

export const IntensityTimeSeriesSchema = z.object({
  time: z.array(z.number()),
  intensity: z.array(z.number()),
});

export const FormantsTimeSeriesSchema = z.object({
  time: z.array(z.number()),
  F1: z.array(z.number()),
  F2: z.array(z.number()),
  F3: z.array(z.number()),
  F4: z.array(z.number()),
  F5: z.array(z.number()),
});

// Formant statistics schema (reusable for F1-F5)
export const FormantStatisticsSchema = z.object({
  mean: z.number(),
  std: z.number(),
  range: z.number(),
  min: z.number(),
  max: z.number(),
  total_frames: z.number(),
  valid_frames: z.number(),
});

// Fundamental frequency schema
export const FundamentalFrequencySchema = z.object({
  time_series: FundamentalFrequencyTimeSeriesSchema,
  mean_f0: z.number(),
  std_f0: z.number(),
  range_f0: z.number(),
  min_f0: z.number(),
  max_f0: z.number(),
  voiced_fraction: z.number(),
  total_frames: z.number(),
  voiced_frames: z.number(),
});

// Intensity schema
export const IntensitySchema = z.object({
  time_series: IntensityTimeSeriesSchema,
  mean_intensity: z.number(),
  std_intensity: z.number(),
  range_intensity: z.number(),
  min_intensity: z.number(),
  max_intensity: z.number(),
  variability: z.number(),
  total_frames: z.number(),
  valid_frames: z.number(),
});

// Formants schema
export const FormantsSchema = z.object({
  time_series: FormantsTimeSeriesSchema,
  F1: FormantStatisticsSchema,
  F2: FormantStatisticsSchema,
  F3: FormantStatisticsSchema,
  F4: FormantStatisticsSchema,
  F5: FormantStatisticsSchema,
});

export const AcousticFeaturesSchema = z.object({
  fundamental_frequency: FundamentalFrequencySchema.optional(),
  intensity: IntensitySchema.optional(),
  formants: FormantsSchema.optional(),
});

// Main acoustic results schema
const AcousticResultsSchema = z.object({
  segment_id: z.string().uuid(),
  segment_name: z.string(),
  segment_type: z.literal("acoustic"),
  time_range: TimeRangeSchema,
  acoustic_features: AcousticFeaturesSchema,
});

export const AnalysisResultDataSchema = z.object({
  metadata: MetadataSchema,
  intelligibility_scores: IntelligibilityScoresSchema,
  acoustic_results: z
    .record(z.string().uuid(), AcousticResultsSchema)
    .optional(),
  intelligibility_results: z
    .record(z.string().uuid(), IntelligibilityResultSchema)
    .nullable(),
});

export const AnalysisResultsDataSchema = z.array(AnalysisResultDataSchema);

// Patient schemas
export const PatientSchema = z.object({
  id: z.string(),
  user_id: z.string().nullable(),
  anonymized_id: z.string(),
  notes: z.string().nullable(),
  created_at: z.date().nullable(),
  updated_at: z.date().nullable(),
});

export const CreatePatientSchema = z.object({
  anonymized_id: z.string().min(1, "Anonymized ID is required"),
  notes: z.string().optional(),
});

export const PatientSelectSchema = z.object({
  id: z.string(),
  anonymized_id: z.string(),
});
