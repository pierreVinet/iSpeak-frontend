/**
 * Reusable component for displaying analysis results
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, BarChart3, Download, Copy, CheckCircle } from "lucide-react";
import { AnalysisResult } from "@/types";

interface AnalysisResultsProps {
  result: AnalysisResult;
  onDownload?: () => void;
  onCopyTranscript?: () => void;
}

export function AnalysisResults({
  result,
  onDownload,
  onCopyTranscript,
}: AnalysisResultsProps) {
  const formatNumber = (num: number) => {
    return num.toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Processing Summary */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">
            Processing Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Job ID:</span>
              <p className="font-mono text-xs text-gray-900 mt-1 break-all">
                {result.job_id}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <div className="mt-1">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Completed
                </Badge>
              </div>
            </div>
          </div>

          {onDownload && (
            <div className="pt-4 border-t border-gray-200">
              <Button
                onClick={onDownload}
                className="bg-green-600 hover:bg-green-700 gap-2"
              >
                <Download className="h-4 w-4" />
                Download Results
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
