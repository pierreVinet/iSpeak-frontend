"use client";
import React, { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabsNumber from "./tabs-number";
import TabsFile from "./tabs-file";
import TabsAnalysis from "./tabs-analysis";
import TabsResults from "./tabs-results";
import { PatientSelect, RegionTimeRange, UploadTabsNames } from "@/types";
import { useFileUpload } from "@/contexts/file-upload";

const UploadTabs = ({ patients }: { patients: PatientSelect[] }) => {
  const { resetAnalysis, activeTab, setActiveTab, step, state } =
    useFileUpload();

  // 1) TAB FILE INFO
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);

  // 2) TAB ANALYSIS
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string>("");
  const [selectedRange, setSelectedRange] = useState<RegionTimeRange | null>(
    null
  );

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleReset = () => {
    resetAnalysis();
    setSelectedRange(null);
    setIsProcessing(false);
    setIsProcessed(false);
    setIsDragging(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as UploadTabsNames)}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger
          value="file-info"
          className="cursor-pointer"
          disabled={state.isProcessing}
          onClick={() => {
            setSelectedRange(null);
          }}
        >
          <TabsNumber number={1} />
          <span className="hidden md:block">Select Session</span>
        </TabsTrigger>
        <TabsTrigger
          value="audio-analysis"
          disabled={step <= 1 || state.isProcessing}
          className="cursor-pointer"
        >
          <TabsNumber number={2} />
          <span className="hidden md:block">Analyze Session</span>
        </TabsTrigger>
        <TabsTrigger
          value="results"
          disabled={step <= 2}
          className="cursor-pointer"
          onClick={() => {
            setSelectedRange(null);
          }}
        >
          <TabsNumber number={3} />
          <span className="hidden md:block">Session Results</span>
        </TabsTrigger>
      </TabsList>
      <TabsFile
        patients={patients}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        isProcessed={isProcessed}
        setIsProcessed={setIsProcessed}
        fileInputRef={fileInputRef}
        handleReset={handleReset}
      />
      <TabsAnalysis
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        loadError={loadError}
        setLoadError={setLoadError}
        selectedRange={selectedRange}
        setSelectedRange={setSelectedRange}
      />
      <TabsResults />
    </Tabs>
  );
};

export default UploadTabs;
