import {
  AnalysisResultData,
  PhonemeData,
  TranscriptionReference,
} from "@/types";
import { IntelligibilityScoreCard } from "./intelligibility-score-card";
import TranscriptionReferenceResults from "./transcription-reference-results";
import {
  extractMisspelledPhonemicData,
  transformToUIReferenceHypothesis,
} from "@/lib/utils";
import { Card } from "@/components/ui/card";
import PhonemeHeader from "./phoneme-header";
import PhonemeContent from "./phoneme-content";
import TypeHeader from "../type-header";

interface IntelligibilitySectionProps {
  assessment: AnalysisResultData;
}

export function IntelligibilitySection({
  assessment,
}: IntelligibilitySectionProps) {
  const { sortedData, maxMisspellings, colorCategories, totalPhonemes } =
    extractMisspelledPhonemicData(assessment);
  const { intelligibility_results, intelligibility_scores } = assessment;

  const int_results_values = Object.values(intelligibility_results || {});

  const wordReferenceData: TranscriptionReference[] = int_results_values
    .filter((result) => result.intelligibility_type === "words")
    .map(transformToUIReferenceHypothesis);

  const sentenceReferenceData: TranscriptionReference[] = int_results_values
    .filter((result) => result.intelligibility_type === "sentences")
    .map(transformToUIReferenceHypothesis);

  return (
    <div className="space-y-6">
      <TypeHeader
        title="Intelligibility"
        description="Analysis of speech clarity and phonetic accuracy"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IntelligibilityScoreCard scores={intelligibility_scores} />

        <Card className="">
          <PhonemeHeader
            title="Phonemes Errors"
            description="Phonemes of words that didn't match the reference. Ranked by frequency."
            showMore
            assessmentId={assessment.metadata.job_id}
            totalPhonemes={totalPhonemes}
          />
          <PhonemeContent
            maxMisspellings={maxMisspellings}
            sortedData={sortedData}
            colorCategories={colorCategories}
            maxPhonemes={8}
            showLegend
          />
        </Card>
        {wordReferenceData.length > 0 && (
          <>
            {wordReferenceData.map((assessment) => (
              <TranscriptionReferenceResults
                key={assessment.id}
                mode="word"
                title={assessment.title}
                data={assessment.data}
              />
            ))}
          </>
        )}
        {sentenceReferenceData.length > 0 && (
          <>
            {sentenceReferenceData.map((assessment) => (
              <TranscriptionReferenceResults
                key={assessment.id}
                mode="sentence"
                title={assessment.title}
                data={assessment.data}
                itemsPerRow={2}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
