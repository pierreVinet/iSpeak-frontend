"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import posthog from "posthog-js";

const ViewAssessmentButton = ({ jobId }: { jobId: string }) => {
  return (
    <Button asChild variant="default" className="">
      <Link
        href={`/dashboard/assessments/${jobId}`}
        onClick={() => {
          posthog.capture("view_assessment_job_completed", { job_id: jobId });
        }}
      >
        View Assessment
      </Link>
    </Button>
  );
};

export default ViewAssessmentButton;
