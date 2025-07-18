"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import RadialChart from "./radial-chart";
import { IntelligibilityScoresSchema } from "@/lib/zod";
import { z } from "zod";
import { getScoreLabel } from "@/lib/utils";
import { getScoreColor } from "@/lib/utils";

type Scores = z.infer<typeof IntelligibilityScoresSchema>;
interface IntelligibilityScoreCardProps {
  scores: Scores;
}

export function IntelligibilityScoreCard({
  scores,
}: IntelligibilityScoreCardProps) {
  const isSentence = scores.sentences_wer !== null;
  const isWord = scores.words_wer !== null;
  console.log("scores", scores);
  // Calculate separate scores
  const wordScore =
    scores.words_wer || scores.words_wer === 0
      ? (1 - scores.words_wer) * 100
      : 0;
  const sentenceScore =
    scores.sentences_wer || scores.sentences_wer === 0
      ? (1 - scores.sentences_wer) * 100
      : 0;
  const overallScore = scores.total_wer ? (1 - scores.total_wer) * 100 : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Intelligibility Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 h-full grow flex flex-col justify-center items-center">
        <div className="flex items-center justify-center my-auto">
          <div className="relative w-50 h-50">
            <RadialChart
              title={getScoreLabel(overallScore)}
              value={overallScore}
              fill={getScoreColor(overallScore)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Separator className="mb-2" />
        {isWord && (
          <div className="w-full flex justify-between text-sm">
            <span className="text-muted-foreground">Word-level:</span>
            <span
              className={`font-medium`}
              style={{ color: getScoreColor(wordScore) }}
            >
              {Math.round(wordScore)}%
            </span>
          </div>
        )}
        {isSentence && (
          <div className="w-full flex justify-between text-sm">
            <span className="text-muted-foreground">Sentence-level:</span>
            <span
              className={`font-medium`}
              style={{ color: getScoreColor(sentenceScore) }}
            >
              {Math.round(sentenceScore)}%
            </span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
