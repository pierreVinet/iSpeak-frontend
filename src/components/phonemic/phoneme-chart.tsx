import React from "react";
import PhonemeBlock from "./phoneme-block";
import SectionHeader from "./section-header";
import phonemicData from "@/data/phonemic-chart.json";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

interface PhonemeChartProps {
  className?: string;
}

const PhonemeChart: React.FC<PhonemeChartProps> = ({ className }) => {
  return (
    <div className={cn("w-full h-full flex flex-col", className)}>
      {/* Main Chart Header */}
      <div className="flex justify-between items-start mb-6">
        <SectionHeader
          title="Phonemic Chart"
          variant="primary"
          className="text-right flex-1"
        />
      </div>

      {/* Vowels Section */}
      <div className="mb-8 flex-1">
        <div className="flex items-stretch gap-2 h-full">
          {/* Vowels Label */}
          <div className="bg-gray-100 p-2 flex items-center justify-center w-20 text-lg font-bold">
            <div className="transform -rotate-90 whitespace-nowrap">VOWELS</div>
          </div>

          {/* Vowels Content */}
          <div className="grid h-full">
            {/* Headers for Monophthongs and Diphthongs */}
            <div className="flex mb-2 gap-2">
              <div className="flex-1 text-center font-bold text-base py-2 bg-gray-100">
                Monophthongs
              </div>

              <div className="flex-1 text-center font-bold text-base py-2 bg-gray-100">
                Diphthongs
              </div>
            </div>

            {/* Vowel Blocks */}
            <div className="flex items-start flex-1 gap-2">
              {/* Monophthongs */}
              <div className="flex-1 flex items-start flex-wrap content-start">
                {phonemicData.vowels.monophthongs.map((phoneme, index) => (
                  <PhonemeBlock
                    key={index}
                    phonemic={phoneme.phonemic}
                    phonetic={phoneme.phonetic}
                    example={phoneme.example}
                    underline={phoneme.underline}
                    variant="vowel"
                  />
                ))}
              </div>

              {/* Diphthongs */}
              <div className="flex-1 flex items-start flex-wrap content-start">
                {phonemicData.vowels.diphthongs.map((phoneme, index) => (
                  <PhonemeBlock
                    key={index}
                    phonemic={phoneme.phonemic}
                    phonetic={phoneme.phonetic}
                    example={phoneme.example}
                    underline={phoneme.underline}
                    variant="vowel"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consonants Section */}
      <div className="flex-1">
        <div className="flex items-stretch gap-2 h-full">
          {/* Consonants Label */}
          <div className="bg-yellow-100 p-2 flex items-center justify-center w-20 text-lg font-bold">
            <div className="transform -rotate-90 whitespace-nowrap">
              CONSONANTS
            </div>
          </div>

          {/* Consonants Content */}
          <div className="flex-1 flex items-start">
            <div className="flex flex-wrap content-start">
              {phonemicData.consonants.map((phoneme, index) => (
                <PhonemeBlock
                  key={index}
                  phonemic={phoneme.phonemic}
                  phonetic={phoneme.phonetic}
                  example={phoneme.example}
                  underline={phoneme.underline}
                  variant="consonant"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhonemeChart;
