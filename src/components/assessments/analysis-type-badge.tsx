import { Mic } from "lucide-react";
import React from "react";
import { Badge } from "../ui/badge";
import { Activity } from "lucide-react";
import { AnalysisType } from "@/types";

const AnalysisTypeBadge = ({
  analysisType,
}: {
  analysisType: AnalysisType;
}) => {
  if (analysisType === "intelligibility") {
    return (
      <Badge variant="outline" className="text-xs bg-green-100 text-green-950">
        <Mic className="h-3 w-3 mr-1 text-green-600" />
        Intelligibility
      </Badge>
    );
  }
  if (analysisType === "acoustic") {
    return (
      <Badge
        variant="outline"
        className="text-xs bg-purple-100 text-purple-950"
      >
        <Activity className="h-3 w-3 mr-1 text-purple-600" />
        Acoustic
      </Badge>
    );
  }
  return null;
};

export default AnalysisTypeBadge;
