import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Calendar, Mic, Activity } from "lucide-react";
import { AnalysisResultData, PatientSelect } from "@/types";
import { User as UserAuth } from "next-auth";
import {
  formatDate,
  formatTime,
  getScoreColor,
  getScoreLabel,
} from "@/lib/utils";
import RadialChart from "./intelligibility/radial-chart";
import Link from "next/link";
import AnalysisTypeBadge from "./analysis-type-badge";

interface AssessmentCardProps {
  assessment: AnalysisResultData;
  user: UserAuth;
  patient: PatientSelect | undefined;
}

export function AssessmentCard({
  assessment,
  user,
  patient,
}: AssessmentCardProps) {
  // Calculate overall intelligibility score
  const overallScore = assessment.intelligibility_scores.total_wer
    ? (1 - assessment.intelligibility_scores.total_wer) * 100
    : 0;

  const isIntelligibility =
    assessment.metadata.analysis_types.includes("intelligibility");
  const isAcoustic = assessment.metadata.analysis_types.includes("acoustic");

  return (
    <Link
      href={`/dashboard/assessments/${assessment.metadata.job_id}`}
      className="w-full "
    >
      <Card className="w-full shadow-none hover:bg-background/10  transition-all cursor-pointer duration-150">
        <CardContent className="">
          <div className="flex items-center justify-between">
            {/* Left side - Assessment info */}
            <div className="flex flex-col gap-4 w-full">
              {/* badges */}
              <div className="flex flex-wrap items-center gap-3 min-h-[22px]">
                {assessment.metadata.analysis_types.map((type) => (
                  <AnalysisTypeBadge key={type} analysisType={type} />
                ))}
              </div>

              {/* Main info row */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                {/* Patient */}
                <div className="flex items-center space-x-2 min-w-0">
                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex flex-row gap-1 items-center">
                    <p className="text-sm text-muted-foreground">Patient</p>
                    <p className="font-medium text-sm truncate">
                      {patient ? patient.anonymized_id : "Unknown"}
                    </p>
                  </div>
                </div>

                {/* Therapist */}
                {/* <div className="flex items-center space-x-2 min-w-0">
                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">Therapist</p>
                    <p className="font-medium text-sm truncate">{user.name}</p>
                  </div>
                </div> */}

                {/* Duration */}
                <div className="flex items-center space-x-2 min-w-0">
                  <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex flex-row gap-1 items-center">
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium text-sm">
                      {formatTime(assessment.metadata.duration, true)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Full date */}
              <div className="text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(assessment.metadata.date, true)}
                </Badge>
              </div>
            </div>

            {/* Right side - Radial chart */}

            {isIntelligibility && (
              <div className="relative w-28 h-28 flex-shrink-0">
                <RadialChart
                  title={getScoreLabel(overallScore)}
                  value={overallScore}
                  fill={getScoreColor(overallScore)}
                  size="sm"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
