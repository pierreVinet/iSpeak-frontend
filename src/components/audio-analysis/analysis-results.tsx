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
      {/* Transcription Results */}
      {result.transcript && (
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Speech Transcription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                {result.transcript}
              </p>
            </div>
            <div className="flex gap-2">
              {onCopyTranscript && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCopyTranscript}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy Text
                </Button>
              )}
              <Badge variant="secondary" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Transcribed
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formant Analysis Results */}
      {result.formants && (
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Formant Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  First Formant (F1)
                </h4>
                <p className="text-2xl font-bold text-blue-700">
                  {formatNumber(result.formants.f1_mean)} Hz
                </p>
                <p className="text-xs text-blue-600 mt-1">Vowel height</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-900 mb-1">
                  Second Formant (F2)
                </h4>
                <p className="text-2xl font-bold text-green-700">
                  {formatNumber(result.formants.f2_mean)} Hz
                </p>
                <p className="text-xs text-green-600 mt-1">Vowel frontness</p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-purple-900 mb-1">
                  Third Formant (F3)
                </h4>
                <p className="text-2xl font-bold text-purple-700">
                  {formatNumber(result.formants.f3_mean)} Hz
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  Vocal tract length
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <span className="font-medium">
                  {result.formants.analysis_points}
                </span>{" "}
                analysis points
              </div>
              <Badge variant="secondary" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Analyzed
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

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
