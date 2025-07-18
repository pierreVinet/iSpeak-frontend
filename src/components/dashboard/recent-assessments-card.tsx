import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  formatDate,
  formatUUID,
  getScoreColor,
  getScoreLabel,
} from "@/lib/utils";
import { AnalysisResultData, Patient } from "@/types";
import { ArrowRight, FileText } from "lucide-react";
import AnalysisTypeBadge from "../assessments/analysis-type-badge";

interface RecentAssessmentsCardProps {
  assessments: AnalysisResultData[];
  patients: Patient[];
}

const RecentAssessmentsCard = ({
  assessments,
  patients,
}: RecentAssessmentsCardProps) => {
  const recentAssessments = assessments.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="">Recent Assessments</CardTitle>
        <Button variant="link" asChild>
          <Link
            href="/dashboard/assessments"
            className="flex items-center gap-2"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentAssessments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4  text-muted-foreground">No assessments yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentAssessments.map((assessment) => {
              const date = assessment.metadata.date
                ? new Date(assessment.metadata.date).toLocaleDateString()
                : "No date";
              const patient = patients.find(
                (p) => p.id === assessment.metadata.patient_id
              );
              const score =
                assessment.intelligibility_scores.total_wer !== null
                  ? 100 - assessment.intelligibility_scores.total_wer * 100
                  : undefined;

              return (
                <Link
                  key={assessment.metadata.job_id}
                  href={`/assessments/${assessment.metadata.job_id}`}
                  className="block"
                >
                  <div className="flex items-center gap-4 justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="space-y-1 w-full">
                      <div className="flex flex-row flex-wrap gap-2 items-center w-full shrink">
                        <p className="font-medium">
                          Patient {patient?.anonymized_id}
                        </p>
                        {assessment.metadata.analysis_types.map((type) => (
                          <AnalysisTypeBadge key={type} analysisType={type} />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(date)}
                      </p>
                    </div>
                    {score !== undefined && (
                      <div
                        className="text-right shrink-0"
                        style={{ color: getScoreColor(score) }}
                      >
                        <p className="font-semibold">{Math.round(score)}%</p>
                        {/* <p className="text-sm">{getScoreLabel(score)}</p> */}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentAssessmentsCard;
