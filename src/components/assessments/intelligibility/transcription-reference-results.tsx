import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { TranscriptionReferenceData, WordWithAlignementType } from "@/types";
import React from "react";

// Define the common data structure for both word and sentence level

interface TranscriptionReferenceResultsProps {
  title: string;
  data: TranscriptionReferenceData[];
  mode: "word" | "sentence";
  itemsPerRow?: number;
}

const TranscriptionReferenceResults = ({
  data,
  title,
  mode,
  itemsPerRow,
}: TranscriptionReferenceResultsProps) => {
  // Set default items per row based on mode
  const defaultItemsPerRow = mode === "word" ? 5 : 2;
  const maxItemsPerRow = itemsPerRow || defaultItemsPerRow;
  const nbItemsCorrect = data.filter((item) => item.correct === true).length;
  const nbItems = data.length;

  return (
    <Card className="border-gray-200 bg-white shadow-sm col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg flex flex-row justify-between items-center text-gray-900">
          <span className="flex flex-row items-center gap-3">
            {mode === "word"
              ? "Word-Level Assessment"
              : "Sentence-Level Assessment"}
            <span className="text-gray-500 font-mono">
              {nbItemsCorrect}/{nbItems}
            </span>
          </span>
          <Badge className="hidden sm:flex" variant="secondary">
            {title}
          </Badge>
        </CardTitle>
        <CardDescription className="text-gray-600">
          Reference vs. Patient transcription comparison
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Array.from({
            length: Math.ceil(data.length / maxItemsPerRow),
          }).map((_, rowIndex) => {
            const rowItems = data.slice(
              rowIndex * maxItemsPerRow,
              rowIndex * maxItemsPerRow + maxItemsPerRow
            );
            return (
              <div key={rowIndex} className="space-y-3">
                <div className="flex gap-4">
                  {/* Labels column */}
                  <div className="flex flex-col justify-start w-16 text-left">
                    <div className="text-xs text-gray-600 tracking-wide mb-2.5 mt-1.5 font-bold">
                      Patient
                    </div>
                    <div className="text-xs text-gray-600 tracking-wide">
                      Reference
                    </div>
                  </div>

                  {/* Vertical separator */}
                  <div className="w-px bg-gray-200 self-stretch mx-2 mr-3" />

                  {/* Content area with grouped transcription-reference blocks */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-8">
                      {rowItems.map((item, index) => {
                        const isTranscriptionNotEmpty =
                          item.transcription.length > 0;
                        return (
                          <div
                            key={index}
                            className={`${
                              mode === "word"
                                ? "min-w-[120px] max-w-[200px] flex-1"
                                : "min-w-[200px] max-w-[650px] flex-1"
                            } space-y-1`}
                          >
                            {/* Patient transcription */}
                            <div
                              className={`font-mono relative text-base min-h-6 ${
                                isTranscriptionNotEmpty
                                  ? item.correct
                                    ? "text-green-600"
                                    : "text-red-600"
                                  : "text-gray-500 italic"
                              }  break-words hyphens-auto`}
                            >
                              <span className="absolute -left-7 text-xs top-[5px] w-6 text-right text-gray-500">
                                {item.index + 1}.
                              </span>{" "}
                              {isTranscriptionNotEmpty ? (
                                <DisplayTranscriptionFromWordWithAlignementType
                                  title={title}
                                  sentenceId={index}
                                  transcription={item.transcription}
                                />
                              ) : (
                                "[empty]"
                              )}
                            </div>
                            {/* Reference text */}
                            <div className=" font-mono text-base text-gray-500 break-words hyphens-auto">
                              {item.reference}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {rowIndex < Math.ceil(data.length / maxItemsPerRow) - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TranscriptionReferenceResults;

const DisplayTranscriptionFromWordWithAlignementType = ({
  transcription,
  title,
  sentenceId,
}: {
  transcription: WordWithAlignementType[] | string;
  title: string;
  sentenceId: number;
}) => {
  if (typeof transcription === "string") {
    return <>{transcription}</>;
  }

  return (
    <div>
      {transcription.map((item) => (
        <span
          key={`${title}-${sentenceId}-${item.index}`}
          className={cn(
            item.type === "delete" && "text-red-500",
            item.type === "equal" && "text-green-500",
            item.type === "substitute" && "text-red-500"
          )}
        >{`${item.word} `}</span>
      ))}
    </div>
  );
};
