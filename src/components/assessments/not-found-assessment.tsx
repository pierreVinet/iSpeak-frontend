import React from "react";
import { Button } from "../ui/button";
import { Link } from "lucide-react";

const NotFoundAssessment = ({ assessmentId }: { assessmentId: string }) => {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-destructive">
          Assessment Not Found
        </h1>
        <p className="text-muted-foreground mt-2">
          The assessment with ID "{assessmentId}" could not be found.
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/assessments">Back to Assessments</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundAssessment;
