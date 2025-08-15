import PhonemeContent from "@/components/assessments/intelligibility/phoneme-content";
import PhonemeHeader from "@/components/assessments/intelligibility/phoneme-header";
import NotFoundAssessment from "@/components/assessments/not-found-assessment";
import PhonemeChart from "@/components/phonemic/phoneme-chart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  extractMisspelledPhonemicData,
  extractCorrectPhonemicData,
  formatUUID,
} from "@/lib/utils";
import { getAuthSession } from "@/server/auth";
import { PhonemeData } from "@/types";
import { getAnalysisResultsByJobIdUseCase } from "@/use-cases/audio-analysis";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const PhonemesPage = async ({
  params,
}: {
  params: Promise<{
    assessmentId: string;
  }>;
}) => {
  const { assessmentId } = await params;

  const session = await getAuthSession();
  const user = session?.user;

  if (!user) {
    return <div>Unauthorized</div>;
  }

  const [assessment] = await Promise.all([
    getAnalysisResultsByJobIdUseCase(user.id, assessmentId),
  ]);

  if (!assessment) {
    return <NotFoundAssessment assessmentId={assessmentId} />;
  }
  const { sortedData, maxMisspellings, colorCategories, totalPhonemes } =
    extractMisspelledPhonemicData(assessment);
  const {
    sortedData: correctData,
    maxCorrect,
    totalPhonemes: totalCorrect,
  } = extractCorrectPhonemicData(assessment);

  const mockPhonemesData: PhonemeData[] = [
    { phoneme: "ə", count: 10 },
    { phoneme: "ʃ", count: 9 },
    { phoneme: "dʒ", count: 8 },
    { phoneme: "ŋ", count: 7 },
    { phoneme: "ɜː", count: 6 },
    { phoneme: "eɪ", count: 6 },
    { phoneme: "tʃ", count: 5 },
    { phoneme: "aɪ", count: 5 },
    { phoneme: "ɔː", count: 5 },
    { phoneme: "ɒ", count: 5 },
    { phoneme: "ɪə", count: 4 },
    { phoneme: "eə", count: 4 },
    { phoneme: "ʊə", count: 4 },
    { phoneme: "p", count: 4 },
    { phoneme: "g", count: 3 },
    { phoneme: "k", count: 3 },
    { phoneme: "æ", count: 3 },
    { phoneme: "ɪ", count: 3 },
    { phoneme: "v", count: 2 },
    { phoneme: "f", count: 2 },
    { phoneme: "s", count: 2 },
    { phoneme: "r", count: 2 },
    { phoneme: "m", count: 2 },
    { phoneme: "i", count: 1 },
    { phoneme: "h", count: 1 },
    { phoneme: "z", count: 1 },
    { phoneme: "ʊ", count: 1 },
    { phoneme: "l", count: 1 },
    { phoneme: "ʌ", count: 1 },
    { phoneme: "θ", count: 1 },
    { phoneme: "ð", count: 1 },
    { phoneme: "b", count: 1 },
    { phoneme: "j", count: 1 },
    { phoneme: "u", count: 1 },
    { phoneme: "oʊ", count: 1 },
    { phoneme: "aʊ", count: 1 },
    { phoneme: "ɔɪ", count: 1 },
    { phoneme: "ɡ", count: 1 },
    { phoneme: "w", count: 1 },
  ];

  return (
    <div className="container mx-auto  space-y-8 mb-32">
      <div className="space-y-6">
        <Button asChild variant="outline">
          <Link href={`/dashboard/assessments/${assessmentId}`}>
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Assessment
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Phonemes Details
          </h2>
          <p className="text-muted-foreground">
            Phonemes details for the assessment{" "}
            <span className="font-mono font-medium">
              {formatUUID(assessmentId)}
            </span>
          </p>
        </div>

        <div className="w-full flex flex-col gap-6">
          {/* Phonemic Chart */}
          <Card className="p-6">
            <PhonemeChart />
          </Card>

          <Card className="">
            <PhonemeHeader
              title="Phonemes Errors"
              description="Phonemes of words that didn't match the reference. Ranked by frequency."
              assessmentId={assessmentId}
              totalPhonemes={totalPhonemes}
            />
            <PhonemeContent
              maxMisspellings={maxMisspellings}
              sortedData={sortedData}
              colorCategories={colorCategories}
              type="misspelled"
            />
            <PhonemeHeader
              title="Phonemes Correct"
              description="Phonemes of words that matched the reference. Ranked by frequency."
              assessmentId={assessmentId}
              totalPhonemes={totalCorrect}
            />
            <PhonemeContent
              maxMisspellings={maxCorrect}
              sortedData={correctData}
              colorCategories={[]}
              type="correct"
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PhonemesPage;
