import React from "react";
import { cn } from "@/lib/utils";

interface PhonemeBlockProps {
  phonemic: string;
  phonetic: string;
  example: string;
  underline: string;
  variant?: "vowel" | "consonant";
  className?: string;
}

const PhonemeBlock: React.FC<PhonemeBlockProps> = ({
  phonemic,
  phonetic,
  example,
  underline,
  variant = "vowel",
  className,
}) => {
  // Helper function to underline specific letters in the example word
  const renderExample = () => {
    const lowerExample = example.toLowerCase();
    const lowerUnderline = underline.toLowerCase();
    const startIndex = lowerExample.indexOf(lowerUnderline);

    if (startIndex === -1) {
      return <span>{example}</span>;
    }

    const before = example.substring(0, startIndex);
    const highlighted = example.substring(
      startIndex,
      startIndex + underline.length
    );
    const after = example.substring(startIndex + underline.length);

    return (
      <span>
        {before}
        <span className="underline">{highlighted}</span>
        {after}
      </span>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-3 border border-gray-300 bg-white text-center min-w-[100px] h-[100px]",
        variant === "vowel" && "bg-gray-100",
        variant === "consonant" && "bg-yellow-100",
        className
      )}
    >
      {/* Phonemic symbol (top) */}
      <div className="text-2xl font-bold mb-1 leading-none">{phonemic}</div>

      {/* Example word (bottom) */}
      <div className="text-sm leading-tight">{renderExample()}</div>
    </div>
  );
};

export default PhonemeBlock;
