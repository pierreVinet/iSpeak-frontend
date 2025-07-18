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
  itemsPerRow = 5,
}: TranscriptionReferenceResultsProps) => {
  return (
    <Card className="border-gray-200 bg-white shadow-sm col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg flex flex-row justify-between items-centertext-gray-900">
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
          {/* {mode === "word" ? (
            // Word-level display with multiple items per row */}
          {Array.from({
            length: Math.ceil(data.length / itemsPerRow),
          }).map((_, rowIndex) => {
            const rowItems = data.slice(
              rowIndex * itemsPerRow,
              rowIndex * itemsPerRow + itemsPerRow
            );
            return (
              <div key={rowIndex} className="space-y-2">
                {/* Transcription words */}
                <div className="flex gap-6">
                  {rowItems.map((item, index) => (
                    <div key={index} className="flex-1">
                      <div
                        className={`font-mono text-base ${
                          item.correct ? "text-green-600" : "text-red-600"
                        } font-medium`}
                      >
                        {item.transcription}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Reference words */}
                <div className="flex gap-6">
                  {rowItems.map((item, index) => (
                    <div key={index} className="flex-1">
                      <div className="font-mono text-sm text-gray-500">
                        {item.reference}
                      </div>
                    </div>
                  ))}
                </div>
                {rowIndex < Math.ceil(data.length / itemsPerRow) - 1 && (
                  <Separator className="my-2" />
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
