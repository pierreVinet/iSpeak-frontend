import React from "react";
import PhonemeBlock from "./phoneme-block";
import SectionHeader from "./section-header";
import phonemicData from "@/data/phonemic-chart.json";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface PhonemeChartProps {
  className?: string;
}

interface PhonemeData {
  phonemic: string;
  phonetic: string;
  example: string;
  underline: string;
}

interface PhonemeSectionProps {
  phonemes: PhonemeData[];
  variant: "vowel" | "consonant";
}

interface CategoryLabelProps {
  text: string;
  variant: "vowel" | "consonant";
}

const PhonemeChart: React.FC<PhonemeChartProps> = ({ className }) => {
  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Phonemic Chart</CardTitle>
      </CardHeader>
      <CardContent className={cn("w-full h-full flex flex-col", className)}>
        {/* Vowels Section */}
        <div className="mb-2 flex-1">
          <div className="flex items-stretch gap-2 h-full">
            {/* <CategoryLabel text="VOWELS" variant="vowel" /> */}

            {/* Vowels Content */}
            <div className="grid h-full">
              {/* Headers for Monophthongs and Diphthongs */}
              <div className="flex mb-2 gap-2">
                <ThongHeader thong="Monophthongs" />
                <ThongHeader thong="Diphthongs" />
              </div>

              {/* Vowel Blocks */}
              <div className="flex items-start flex-1 gap-2">
                <PhonemeSection
                  phonemes={phonemicData.vowels.monophthongs}
                  variant="vowel"
                />
                <PhonemeSection
                  phonemes={phonemicData.vowels.diphthongs}
                  variant="vowel"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Consonants Section */}
        <div className="flex-1">
          <div className="flex items-stretch gap-2 h-full">
            {/* <CategoryLabel text="CONSONANTS" variant="consonant" /> */}

            {/* Consonants Content */}
            <div className="flex-1 flex items-start">
              <PhonemeSection
                phonemes={phonemicData.consonants}
                variant="consonant"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default PhonemeChart;

const CategoryLabel: React.FC<CategoryLabelProps> = ({ text, variant }) => {
  return (
    <div
      className={cn(
        "p-2 flex items-center justify-center w-20 font-bold rounded",
        variant === "vowel" && "bg-gray-100",
        variant === "consonant" && "bg-yellow-100"
      )}
    >
      <div className="transform -rotate-90 whitespace-nowrap">{text}</div>
    </div>
  );
};

const PhonemeSection: React.FC<PhonemeSectionProps> = ({
  phonemes,
  variant,
}) => {
  return (
    <div className="flex-1 flex items-start flex-wrap content-start">
      {phonemes.map((phoneme, index) => (
        <PhonemeBlock
          key={index}
          phonemic={phoneme.phonemic}
          phonetic={phoneme.phonetic}
          example={phoneme.example}
          underline={phoneme.underline}
          variant={variant}
        />
      ))}
    </div>
  );
};

const ThongHeader = ({ thong }: { thong: string }) => {
  return (
    <div className="flex-1 text-center font-bold text-base py-2 bg-gray-100 rounded">
      {thong}
    </div>
  );
};
