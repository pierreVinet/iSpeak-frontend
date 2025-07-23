import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import React from "react";
import PhonemeShowMoreButton from "./phoneme-show-more";

interface PhonemeHeaderProps {
  title: string;
  description: string;
  showMore?: boolean;
  assessmentId: string;
  totalPhonemes?: number;
}

const PhonemeHeader = ({
  title,
  description,
  showMore,
  assessmentId,
  totalPhonemes,
}: PhonemeHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-1.5">
          <CardTitle className="text-lg font-semibold">
            {title} {totalPhonemes && !showMore ? `(${totalPhonemes})` : null}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {showMore && (
          <PhonemeShowMoreButton assessmentId={assessmentId}>
            Show More {totalPhonemes ? `(${totalPhonemes})` : null}
          </PhonemeShowMoreButton>
        )}
      </div>
    </CardHeader>
  );
};

export default PhonemeHeader;
