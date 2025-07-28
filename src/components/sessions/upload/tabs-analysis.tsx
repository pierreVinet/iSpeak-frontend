"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import React, { useCallback, useState, useMemo, useEffect } from "react";
import WaveSurfer from "./wave-surfer";
import SelectRange from "./select-range";
import AnalysisSegments from "./analysis-segments";
import { useFileUpload } from "@/contexts/file-upload";
import {
  WaveSurferWithRegionsProps,
  TimeRange,
  AnalysisSegment,
  RegionTimeRange,
  TabsAnalysisProps,
} from "@/types";
import { generateId } from "@/lib/utils";
import { AnalysisRequestWithSegmentsSchema } from "@/lib/zod";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const TabsAnalysis = ({
  isLoading,
  setIsLoading,
  loadError,
  setLoadError,
  selectedRange,
  setSelectedRange,
}: TabsAnalysisProps) => {
  const {
    file,
    setActiveTab,
    validationErrors,
    startServerAnalysis,
    setStep,
    duration,
    setDuration,
    setAnalysisSegments,
    analysisSegments,
  } = useFileUpload();

  // Memoize the audio URL to prevent creating new URLs on every render
  const audioUrl = useMemo(() => {
    // Only create object URL in the browser environment
    if (typeof window !== "undefined" && file) {
      return URL.createObjectURL(file);
    }
    return null;
  }, [file]);

  // Clean up the URL object when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (audioUrl && typeof window !== "undefined") {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleCancelRangeSelection = () => {
    setSelectedRange(null);
  };

  // Memoize callback functions to prevent recreation on every render
  const handleSetError = useCallback((error: string) => {
    setLoadError(error);
  }, []);

  const handleSetIsLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const handleRegionUpdate = useCallback((range: RegionTimeRange) => {
    setSelectedRange(range);
  }, []);

  const handleRangeChange = useCallback((range: TimeRange) => {
    setSelectedRange(range);
  }, []);

  const handleAddAnalysis = useCallback(
    (analysis: Omit<AnalysisSegment, "id" | "createdAt" | "updatedAt">) => {
      const newSegment: AnalysisSegment = {
        ...analysis,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("newSegment", newSegment);

      setAnalysisSegments((prev) => [...prev, newSegment]);
      setSelectedRange(null);
    },
    []
  );

  const handleDeleteSegment = useCallback((id: string) => {
    setAnalysisSegments((prev) => prev.filter((segment) => segment.id !== id));
  }, []);

  const handleUpdateSegment = useCallback(
    (id: string, updates: Partial<AnalysisSegment>) => {
      setAnalysisSegments((prev) =>
        prev.map((segment) =>
          segment.id === id
            ? { ...segment, ...updates, updatedAt: new Date() }
            : segment
        )
      );
    },
    []
  );

  const handleBack = () => {
    setActiveTab("file-info");
    setSelectedRange(null);
  };

  const handleStartAnalysis = async () => {
    try {
      // Validate analysis segments before starting
      const validationResult = AnalysisRequestWithSegmentsSchema.safeParse({
        segments: analysisSegments,
      });

      if (!validationResult.success) {
        console.error(
          "Analysis segments validation failed:",
          validationResult.error
        );
        // You could show an error message to the user here
        toast.error("Segments are not valid. Please check your segments.");
        return;
      }

      setStep(3);
      setActiveTab("results");
      await startServerAnalysis();
    } catch (err) {
      console.error("Start analysis failed:", err);
    }
  };

  if (!file) {
    return (
      <TabsContent value="audio-analysis" className="space-y-6 mt-6 pb-20">
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">
              Audio Analysis
            </CardTitle>
            <CardDescription className="text-gray-600">
              Please upload and process a file first to view the audio analysis.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleBack}>Upload</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="audio-analysis" className="space-y-6 mt-6 pb-20">
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">
            Audio Waveform
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error Message */}
          {loadError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{loadError}</p>
              <p className="text-red-600 text-xs mt-1">
                Please try uploading a different audio or video file.
              </p>
            </div>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm font-medium mb-2">
                File validation failed:
              </p>
              <ul className="text-red-600 text-xs space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {audioUrl && (
            <WaveSurferMemo
              audioUrl={audioUrl}
              setError={handleSetError}
              error={loadError}
              setIsLoading={handleSetIsLoading}
              isLoading={isLoading}
              onRegionUpdate={handleRegionUpdate}
              selectedRange={selectedRange}
              analysisSegments={analysisSegments}
              setDuration={setDuration}
              duration={duration}
            />
          )}
        </CardContent>
      </Card>

      {/* Analysis Segments */}
      <AnalysisSegments
        segments={analysisSegments}
        onDeleteSegment={handleDeleteSegment}
        onUpdateSegment={handleUpdateSegment}
        onRangeChange={handleRangeChange}
        onAddAnalysis={handleAddAnalysis}
        selectedRange={selectedRange}
        setSelectedRange={setSelectedRange}
        handleCancelRangeSelection={handleCancelRangeSelection}
        duration={duration}
      />

      {/* Action Buttons */}
      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleStartAnalysis}
          disabled={analysisSegments.length === 0 || !!selectedRange}
        >
          Start Analysis
        </Button>
      </div>
    </TabsContent>
  );
};

const WaveSurferMemo = React.memo(
  ({
    audioUrl,
    setError,
    error,
    setIsLoading,
    isLoading,
    onRegionUpdate,
    selectedRange,
    analysisSegments,
    setDuration,
    duration,
  }: WaveSurferWithRegionsProps) => {
    return (
      <WaveSurfer
        audioUrl={audioUrl}
        setError={setError}
        error={error}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
        onRegionUpdate={onRegionUpdate}
        selectedRange={selectedRange}
        analysisSegments={analysisSegments}
        setDuration={setDuration}
        duration={duration}
      />
    );
  }
);

export default TabsAnalysis;
