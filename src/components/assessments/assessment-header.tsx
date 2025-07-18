import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";
import { AnalysisResultData, PatientSelect } from "@/types";
import { getAuthSession } from "@/server/auth";
import { User as UserAuth } from "next-auth";
import { formatTime } from "@/lib/utils";

interface AssessmentHeaderProps {
  assessment: AnalysisResultData;
  user: UserAuth;
  patient: PatientSelect | undefined;
}

export async function AssessmentHeader({
  assessment,
  user,
  patient,
}: AssessmentHeaderProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Assessment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between  sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center space-x-1">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="">Patient:</span>
              <div>
                <p className="font-medium">
                  {patient ? patient.anonymized_id : "-"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="">Therapist:</span>
              <div>
                <p className=" font-medium">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="">Duration:</span>
              <div>
                <p className=" font-medium">
                  {formatTime(assessment.metadata.duration, true)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3 justify-end">
            <Badge
              variant="secondary"
              className="text-sm bg-blue-100 text-blue-900 border-blue-200"
            >
              {assessment.metadata.date
                ? formatDate(assessment.metadata.date)
                : "No date"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
