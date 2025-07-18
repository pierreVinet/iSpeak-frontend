import React from "react";
import { getAuthSession } from "@/server/auth";
import { getAssessmentsUseCase } from "@/use-cases/assessments";
import { getPatientsUseCase } from "@/use-cases/patients";
import { AssessmentCard } from "@/components/assessments/assessment-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { AnalysisResultData, PatientSelect } from "@/types";
import { groupAssessmentsByMonth } from "@/lib/utils";

const AssessmentPage = async () => {
  const session = await getAuthSession();
  const user = session?.user;

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">
            User Not Found
          </h1>
          <p className="text-muted-foreground mt-2">
            Please login to view assessments.
          </p>
          <Button asChild className="mt-4">
            <Link href="/auth/login">Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  const [assessments, patients] = await Promise.all([
    getAssessmentsUseCase(),
    getPatientsUseCase(),
  ]);

  const groupedAssessments = groupAssessmentsByMonth(assessments);

  return (
    <div className="container mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assessments</h1>
          <p className="text-muted-foreground">
            View and manage your speech therapy assessments
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/sessions/upload" className="w-fit">
            <Plus className="mr-2 h-4 w-4" />
            Create Assessment
          </Link>
        </Button>
      </div>

      {/* Assessments List */}
      {assessments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No assessments yet</h3>
          <p className="mt-2 text-muted-foreground">
            Start by creating your first assessment
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/sessions/upload">
              <Plus className="mr-2 h-4 w-4" />
              Create Assessment
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-8 w-full flex flex-col items-center">
          {groupedAssessments.map((group, groupIndex) => (
            <div key={group.key} className="w-full max-w-4xl">
              {/* Month/Year Header with Separator */}
              <div className="flex items-center gap-4 mb-6">
                <Separator className="flex-1" />
                <h2 className="text-lg font-semibold text-muted-foreground px-4">
                  {group.monthYear}
                </h2>
                <Separator className="flex-1" />
              </div>

              {/* Assessment Cards */}
              <div className="w-full flex flex-col gap-4 items-center">
                {group.assessments.map((assessment) => {
                  const patient = patients.find(
                    (p) => p.id === assessment.metadata.patient_id
                  );

                  return (
                    <AssessmentCard
                      key={assessment.metadata.job_id}
                      assessment={assessment}
                      user={user}
                      patient={patient}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssessmentPage;
