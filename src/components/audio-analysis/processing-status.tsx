/**
 * Reusable component for displaying processing status and steps
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { AudioAnalysisUseCaseError, ProcessingStep } from "@/types";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProcessingStatusProps {
  jobId: string;
  isCompleted: boolean;
  progress: number;
  processingSteps: ProcessingStep[];
  error: AudioAnalysisUseCaseError | null;
  currentStatus: string | null;
  handleRetry: () => void;
}

export function ProcessingStatus({
  jobId,
  isCompleted,
  progress,
  error,
  currentStatus,
  processingSteps,
  handleRetry,
}: ProcessingStatusProps) {
  const getStatusIcon = () => {
    if (isCompleted) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    if (error) {
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
    return <Clock className="h-5 w-5 text-blue-600" />;
  };

  const getStatusTitle = () => {
    if (isCompleted) return "Processing Complete";
    if (error) return "Processing Error";
    return "Processing in Progress";
  };

  const getStepIcon = (status: ProcessingStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStepTextColor = (status: ProcessingStep["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-900";
      case "processing":
        return "text-blue-900";
      case "error":
        return "text-red-900";
      default:
        return "text-gray-600";
    }
  };

  const isProgressBarActive = progress > 0 && progress < 100 && !error;

  return (
    <Card className="border-gray-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
          {getStatusIcon()}
          {getStatusTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        {!error && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Overall Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress
              value={Math.max(progress, 3)}
              className={cn("w-full")}
              classNameIndicator={cn(isProgressBarActive && "animate-pulse ")}
            />
            {currentStatus && (
              <p className="text-xs text-gray-500 capitalize">
                Current: {currentStatus.replace(/_/g, " ")}
              </p>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex w-full  flex-row justify-between items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="">
              <p className="text-red-600 text-sm mt-1">{error.message}</p>
              {error.code && (
                <Badge
                  variant="outline"
                  className="mt-2 text-red-600 border-red-300"
                >
                  {error.code}
                </Badge>
              )}
            </div>
            <Button onClick={handleRetry} className="gap-2">
              <Loader2 className="h-4 w-4" />
              Retry
            </Button>
          </div>
        )}

        {/* Success Message */}
        {isCompleted && (
          <div className="flex flex-col sm:flex-row gap-2 justify-between items-center w-full bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="">
              <p className="text-green-700 text-sm font-medium">
                Processing Complete!
              </p>
              <p className="text-green-600 text-sm mt-1">
                Your file has been successfully processed and analyzed. Results
                are now available.
              </p>
            </div>
            <Button asChild variant="default" className="">
              <Link href={`/dashboard/assessments/${jobId}`}>
                View Assessment
              </Link>
            </Button>
          </div>
        )}

        {/* Processing Steps */}
        {processingSteps.length > 0 &&
          process.env.NODE_ENV === "development" && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">
                Processing Steps
              </h4>
              <div className="space-y-2">
                {processingSteps.map((step) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
                  >
                    <div className="flex-shrink-0">
                      {getStepIcon(step.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          getStepTextColor(step.status)
                        )}
                      >
                        {step.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </CardContent>
    </Card>
  );
}
