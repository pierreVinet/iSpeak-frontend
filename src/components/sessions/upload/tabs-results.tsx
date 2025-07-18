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

  // const handleDownload = () => {
  //   if (!result) return;

  //   // Create downloadable content
  //   const content = {
  //     jobId: result.job_id,
  //     filename: result.filename,
  //     transcript: result.transcript,
  //     formants: result.formants,
  //     timestamp: new Date().toISOString(),
  //   };

  //   const blob = new Blob([JSON.stringify(content, null, 2)], {
  //     type: "application/json",
  //   });

  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = `analysis-results-${result.job_id.slice(0, 8)}.json`;
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   URL.revokeObjectURL(url);
  // };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("video/")) {
      return <FileVideo className="h-6 w-6 text-gray-500" />;
    } else if (file.type.startsWith("audio/")) {
      return <Music className="h-6 w-6 text-gray-500" />;
    } else {
      return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    if (state.isCompleted) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Completed
        </Badge>
      );
    } else if (state.isProcessing) {
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Processing
        </Badge>
      );
    } else if (state.error) {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          Error
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          Ready
        </Badge>
      );
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
      {/* File Information Card */}
      {/* <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">
            File Processing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-gray-100 p-3">
              {getFileIcon(file)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium text-gray-900 truncate">
                {file.name}
              </h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                <span>{formatFileSize(file.size)}</span>
                <span>{file.type}</span>
                {getStatusBadge()}
              </div>
              {jobId && (
                <p className="text-xs text-gray-500 mt-1 font-mono">
                  Job ID: {jobId}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card> */}

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

      {/* Analysis Results */}
      {/* {result && isCompleted && (
        <AnalysisResults
          result={result}
          onDownload={handleDownload}
          onCopyTranscript={handleCopyTranscript}
        />
      )} */}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
    </TabsContent>
  );
};

export default TabsResults;
