"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { FileVideo, Music, File, ArrowLeft, Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { ProcessingStatus } from "@/components/audio-analysis/processing-status";
import { useFileUpload } from "@/contexts/file-upload";

const TabsResults = () => {
  const {
    step,
    file,
    setActiveTab,
    jobId,
    state,
    startServerAnalysis,
    clearError,
    listenToExistingJob,
  } = useFileUpload();

  const handleBack = () => {
    setActiveTab("audio-analysis");
  };

  const handleRetry = async () => {
    if (!file) return;

    clearError();
    try {
      await startServerAnalysis();
    } catch (err) {
      console.error("Retry failed:", err);
    }
  };

  // Handle jobId to listen to existing job or start new analysis
  useEffect(() => {
    if (
      jobId &&
      !state.isProcessing &&
      !state.isCompleted &&
      !state.error &&
      step >= 3
    ) {
      // If we have a jobId, start listening to the existing job
      listenToExistingJob();
    }
  }, [
    file,
    jobId,
    state.isProcessing,
    state.isCompleted,
    state.error,
    state.currentStatus,
    startServerAnalysis,
    listenToExistingJob,
    step,
  ]);

  if (!file) {
    return (
      <TabsContent value="results" className="space-y-6 mt-6 pb-20">
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">
              Processing Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">No file selected for processing.</p>
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="results" className="space-y-6 mt-6 pb-20">
      {/* Processing Status */}
      <ProcessingStatus
        jobId={jobId || ""}
        isCompleted={state.isCompleted}
        progress={state.progress}
        processingSteps={state.processingSteps}
        error={state.error}
        currentStatus={state.currentStatus}
        handleRetry={handleRetry}
      />

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          className="gap-2"
          disabled={state.isProcessing}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
    </TabsContent>
  );
};

export default TabsResults;
