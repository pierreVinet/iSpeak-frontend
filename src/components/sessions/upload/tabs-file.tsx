import React, { useState } from "react";
import {
  AlertTriangle,
  File,
  FileVideo,
  Loader2,
  Music,
  Upload,
  Video,
  X,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { SessionForm } from "./file-infos-form";
import { cn } from "@/lib/utils";
import { useFileUpload } from "@/contexts/file-upload";
import { PatientSelect } from "@/types";
import posthog from "posthog-js";

const TabsFile = ({
  patients,
  isDragging,
  setIsDragging,
  isProcessing,
  setIsProcessing,
  isProcessed,
  setIsProcessed,
  fileInputRef,
  handleReset,
}: {
  patients: PatientSelect[];
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  isProcessed: boolean;
  setIsProcessed: (isProcessed: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;

  handleReset: () => void;
}) => {
  const [uploadTypeError, setUploadTypeError] = useState(false);
  const { file, setFile, setActiveTab, setStep, form } = useFileUpload();

  const handleFile = (file: File) => {
    posthog.capture("upload_file", {
      file_name: file.name,
      file_size: (file.size ? file.size / (1024 * 1024) : 0).toFixed(2) + " MB",
      file_type: file.type,
    });
    if (file.type.startsWith("video/") || file.type.startsWith("audio/")) {
      setFile(file);
      setIsProcessing(true);
      setUploadTypeError(false);

      // Simulate processing delay
      // setTimeout(() => {
      setIsProcessing(false);
      setIsProcessed(true);
      // }, 1000);
    } else {
      setUploadTypeError(true);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleContinue = () => {
    if (isProcessed) {
      form.handleSubmit((data) => {
        setStep(2);
        console.log("File info data:", data, file);
        setActiveTab("audio-analysis");
      })();
    }
  };

  return (
    <TabsContent value="file-info" className="space-y-6 mt-6 pb-20">
      {/* File Upload Area */}
      {!!!file ? (
        <div
          data-testid="file-upload-area"
          className={`border-2 border-dashed rounded-lg p-12 py-20 text-center ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/*, audio/*"
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex w-full justify-center items-center gap-4">
              <div
                className={cn(
                  "rounded-full bg-gray-100 p-4",
                  isProcessing && "animate-pulse"
                )}
              >
                <Video className="h-4 sm:h-8 w-4 sm:w-8 text-gray-500" />
              </div>
              <Separator orientation="vertical" className="h-8!" />
              <div
                className={cn(
                  "rounded-full bg-gray-100 p-4",
                  isProcessing && "animate-pulse"
                )}
              >
                <Music className="h-4 sm:h-8 w-4 sm:w-8 text-gray-500" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Upload Session Recording
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Drag and drop your video or audio file here, or click to browse.{" "}
                <b>Max 10MB</b>
              </p>
            </div>
            {/* Warning Alert */}
            <Alert
              variant="destructive"
              className="border-red-200 bg-red-50 w-96"
            >
              <AlertTitle className="">Important Notice</AlertTitle>
              <AlertDescription className="">
                Don't upload patient data recording. Please use one of the mock
                session audios sent to you.
              </AlertDescription>
            </Alert>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="gap-2"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Select File
            </Button>
            {uploadTypeError && (
              <p className="text-base text-red-500 mt-1">
                Please upload a video or audio file.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">
                Session Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4 shrink-0">
                <div className="rounded-lg bg-gray-100 p-4">
                  {file.type.startsWith("video/") ? (
                    <FileVideo className="h-8 w-8 text-gray-500" />
                  ) : file.type.startsWith("audio/") ? (
                    <Music className="h-8 w-8 text-gray-500" />
                  ) : (
                    <File className="h-8 w-8 text-gray-500" />
                  )}
                </div>
                <div className="flex-1 w-full min-w-0">
                  <h3 className="text-base font-medium text-gray-900 truncate">
                    {file.name}
                  </h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-gray-600">
                    <div>
                      <span>
                        {(file.size ? file.size / (1024 * 1024) : 0).toFixed(2)}{" "}
                        MB
                      </span>
                    </div>
                    <Badge
                      className={cn(
                        "shrink-0",
                        isProcessing
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          : isProcessed
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      )}
                    >
                      {isProcessing
                        ? "Processing..."
                        : isProcessed
                        ? "Ready"
                        : "Waiting"}
                    </Badge>
                  </div>
                </div>
                <Button variant="secondary" size="icon" onClick={handleReset}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <SessionForm patients={patients} form={form} />
            </CardContent>
          </Card>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleContinue}
              disabled={!isProcessed || form.formState.isSubmitting}
              type="submit"
            >
              Continue
            </Button>
          </CardFooter>
        </div>
      )}
    </TabsContent>
  );
};

export default TabsFile;
