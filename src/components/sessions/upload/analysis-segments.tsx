import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Activity, Mic, Plus, X } from "lucide-react";
import { AnalysisSegmentsFormData, AnalysisSegmentsProps } from "@/types";
import { formatTime, generateId } from "@/lib/utils";
import { AnalysisSegmentsFormSchema } from "@/lib/zod";
import SelectRange from "./select-range";
import posthog from "posthog-js";

const AnalysisSegments = ({
  segments,
  onDeleteSegment,
  selectedRange,
  setSelectedRange,
  onRangeChange,
  onAddAnalysis,
  handleCancelRangeSelection,
  duration,
}: AnalysisSegmentsProps) => {
  const form = useForm<AnalysisSegmentsFormData>({
    resolver: zodResolver(AnalysisSegmentsFormSchema),
    defaultValues: {
      segments: segments,
    },
  });

  // Update form when segments change
  React.useEffect(() => {
    form.setValue("segments", segments);
  }, [segments, form]);

  const onSubmit = (data: AnalysisSegmentsFormData) => {
    // submit handled by the parent component
  };

  const handleDeleteSegment = (id: string) => {
    onDeleteSegment(id);
  };

  const handleAddSegment = () => {
    posthog.capture("add_segment_button");
    // Calculate 5% and 95% of the total duration
    const startTime = duration * 0.05;
    const endTime = duration * 0.25;

    // Set the selected range
    setSelectedRange({
      start: startTime,
      end: endTime,
      regionId: `region-${generateId()}`,
    });
  };

  return (
    <Card className="border-gray-200 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg text-gray-900">
            Analysis Segments
          </CardTitle>
        </div>
        <div>
          <Button
            variant="outline"
            className=""
            onClick={handleAddSegment}
            disabled={!!selectedRange}
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Add Segment
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {selectedRange && (
          <SelectRange
            selectedRange={selectedRange}
            onRangeChange={onRangeChange}
            onAddAnalysis={onAddAnalysis}
            handleCancelRangeSelection={handleCancelRangeSelection}
            duration={duration}
            segments={segments}
          />
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {segments.length === 0 && !selectedRange ? (
              <div className="text-center text-gray-500">
                <Activity className="h-12 w-12 mx-auto text-gray-300" />
                <p className="mt-2">
                  Select a range on the waveform or click "Add Segment".
                </p>
              </div>
            ) : (
              segments.length !== 0 && (
                <ScrollArea className="max-h-[300px] overflow-y-auto">
                  <div className="space-y-3">
                    {segments.map((segment, index) => (
                      <div
                        key={segment.id}
                        className="flex flex-row gap-4 items-center justify-center w-full font-medium"
                      >
                        <span className="w-3">{index + 1}.</span>
                        <FormField
                          control={form.control}
                          name={`segments.${index}`}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <div className="w-full flex flex-col sm:flex-row items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md">
                                <div className="w-full flex items-center gap-3">
                                  {segment.type === "acoustic" ? (
                                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                      <Activity className="h-4 w-4 text-purple-600" />
                                    </div>
                                  ) : (
                                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                      <Mic className="h-4 w-4 text-green-600" />
                                    </div>
                                  )}
                                  <div className="w-full space-y-1">
                                    <div className="font-medium text-gray-900">
                                      {segment.name}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {formatTime(segment.timeRange.start)} -{" "}
                                      {formatTime(segment.timeRange.end)} •{" "}
                                      {segment.type}
                                      {segment.type === "intelligibility" && (
                                        <> • </>
                                      )}
                                      {segment.referenceData && (
                                        <span className="text-green-600">
                                          {!!segment.referenceData.sentences
                                            ?.length && (
                                            <>
                                              {segment.referenceData.sentences
                                                ?.length || 0}{" "}
                                              sentences
                                            </>
                                          )}
                                          {!!segment.referenceData.sentences
                                            ?.length &&
                                            !!segment.referenceData.words
                                              ?.length &&
                                            " • "}
                                          {!!segment.referenceData.words
                                            ?.length && (
                                            <>
                                              {segment.referenceData.words
                                                ?.length || 0}{" "}
                                              words
                                            </>
                                          )}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteSegment(segment.id)
                                    }
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Badge variant="outline" className="text-gray-700">
          {segments.length} Segments
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default AnalysisSegments;
