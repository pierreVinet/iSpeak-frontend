import { AssessmentHeader } from "@/components/assessments/assessment-header";
import { IntelligibilitySection } from "@/components/assessments/intelligibility/intelligibility-section";
import { Button } from "@/components/ui/button";
import { getAuthSession } from "@/server/auth";
import { getAnalysisResultsByJobIdUseCase } from "@/use-cases/audio-analysis";
import Link from "next/link";
import { getPatientsUseCase } from "@/use-cases/patients";
import NotFoundAssessment from "@/components/assessments/not-found-assessment";

interface AssessmentPageProps {
  params: Promise<{
    assessmentId: string;
  }>;
}

export default async function AssessmentPage({ params }: AssessmentPageProps) {
  const { assessmentId } = await params;

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
            Please login to view this assessment.
          </p>
          <Button asChild className="mt-4">
            <Link href="/auth/login">Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  const [assessment, patients] = await Promise.all([
    getAnalysisResultsByJobIdUseCase(user.id, assessmentId),
    getPatientsUseCase(),
  ]);

  if (!assessment) {
    return <NotFoundAssessment assessmentId={assessmentId} />;
  }

  console.log(assessment);
  const patient = patients.find(
    (patient) => patient.id === assessment.metadata.patient_id
  );

  const isIntelligibility =
    assessment.metadata.analysis_types.includes("intelligibility");
  const isAcoustic = assessment.metadata.analysis_types.includes("acoustic");

  return (
    <div className="container mx-auto  space-y-8 mb-32">
      {/* Assessment Header */}
      <AssessmentHeader assessment={assessment} user={user} patient={patient} />

      {/* Intelligibility Section */}
      {isIntelligibility && <IntelligibilitySection assessment={assessment} />}
    </div>
  );
}
