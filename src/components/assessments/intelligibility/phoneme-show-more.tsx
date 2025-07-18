import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

interface PhonemeShowMoreButtonProps {
  assessmentId: string;
  children: React.ReactNode;
}

const PhonemeShowMoreButton = ({
  assessmentId,
  children,
}: PhonemeShowMoreButtonProps) => {
  return (
    <Button variant="link" asChild>
      <Link href={`/dashboard/assessments/${assessmentId}/phonemes`}>
        {children}
      </Link>
    </Button>
  );
};

export default PhonemeShowMoreButton;
