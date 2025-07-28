import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TranscriptionReferenceData } from "@/types";
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

  return (
    <Card className="border-gray-200 bg-white shadow-sm col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg flex flex-row justify-between items-center text-gray-900">
          {mode === "word"
            ? "Word-Level Assessment"
            : "Sentence-Level Assessment"}
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
                  <div className="w-px bg-gray-200 self-stretch mx-2"></div>

                  {/* Content area with grouped transcription-reference blocks */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-4">
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
                              className={`font-mono text-base min-h-6 ${
                                isTranscriptionNotEmpty
                                  ? item.correct
                                    ? "text-green-600 font-medium"
                                    : "text-red-600 font-medium"
                                  : "text-gray-500 italic"
                              }  break-words hyphens-auto`}
                            >
                              {isTranscriptionNotEmpty
                                ? item.transcription
                                : "[empty]"}
                            </div>
                            {/* Reference text */}
                            <div className="font-mono text-sm text-gray-500 break-words hyphens-auto">
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
