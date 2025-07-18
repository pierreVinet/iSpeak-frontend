"use client";

import { CardContent } from "@/components/ui/card";
import React, { useEffect, useState, useRef } from "react";
import PhonemeLegend from "./phoneme-legend";
import { PhonemeData } from "@/types";
import BarChart from "./bar-chart";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PhonemeContentProps {
  sortedData: PhonemeData[];
  showLegend?: boolean;
  maxPhonemes?: number;
  maxMisspellings: number;
  colorCategories?: number[];
  type?: "misspelled" | "correct";
}

const getBarColor = (
  index: number,
  type: "misspelled" | "correct" = "misspelled",
  colorCategories?: number[]
) => {
  if (type === "correct") {
    return "bg-green-500";
  }

  const colors = [
    "bg-red-500", // Most misspelled
    "bg-orange-500", // Second most
    "bg-yellow-500", // Third most
  ];

  if (colorCategories && colorCategories[index] !== undefined) {
    return colors[colorCategories[index]] || "bg-gray-500";
  }

  return colors[index] || "bg-gray-500";
};

const PhonemeContent = ({
  sortedData,
  maxPhonemes,
  showLegend,
  maxMisspellings,
  colorCategories = [],
  type = "misspelled",
}: PhonemeContentProps) => {
  const [animatedData, setAnimatedData] = useState<PhonemeData[]>([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate the bars
    const timer = setTimeout(() => {
      setAnimatedData(sortedData);
    }, 200);

    return () => clearTimeout(timer);
  }, [sortedData]);

  useEffect(() => {
    const checkScrollPosition = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainerRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      // Check initial state
      checkScrollPosition();

      // Add scroll event listener
      scrollContainer.addEventListener("scroll", checkScrollPosition);

      // Check on resize
      const resizeObserver = new ResizeObserver(checkScrollPosition);
      resizeObserver.observe(scrollContainer);

      return () => {
        scrollContainer.removeEventListener("scroll", checkScrollPosition);
        resizeObserver.disconnect();
      };
    }
  }, [sortedData]);

  const getBarHeight = (misspellings: number) => {
    if (maxMisspellings === 0) return 0;
    return (misspellings / maxMisspellings) * 100;
  };

  return (
    <CardContent className="space-y-4 w-full">
      {sortedData.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            {type === "correct"
              ? "No correctly spelled phoneme data available"
              : "No phoneme data available"}
          </p>
        </div>
      ) : (
        <>
          {/* Chart with scroll indicators */}
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="w-full h-64 flex items-end space-x-2 px-2 overflow-x-auto pb-2"
            >
              <div className="flex items-end space-x-2 min-w-max mx-auto">
                {sortedData.slice(0, maxPhonemes).map((item, index) => (
                  <BarChart
                    key={item.phoneme}
                    item={item}
                    index={index}
                    animatedData={animatedData}
                    getBarColor={(index) =>
                      getBarColor(index, type, colorCategories)
                    }
                    getBarHeight={getBarHeight}
                  />
                ))}
              </div>
            </div>

            {/* Left scroll indicator */}
            {showLeftArrow && (
              <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <div className="bg-background rounded-full p-1 shadow-md border">
                  <ChevronLeft className="h-4 w-4 text-primary" />
                </div>
              </div>
            )}

            {/* Right scroll indicator */}
            {showRightArrow && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <div className="bg-background rounded-full p-1 shadow-md border">
                  <ChevronRight className="h-4 w-4 text-primary" />
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          {showLegend && (
            <PhonemeLegend
              sortedData={sortedData}
              getBarColor={(index) => getBarColor(index, type, colorCategories)}
            />
          )}

          {/* Summary */}
          {/* <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Total phonemes analyzed:</strong> {sortedData.length} •
                <strong> Total misspellings:</strong>{" "}
                {sortedData.reduce((sum, item) => sum + item.misspellings, 0)} •
                <strong> Most problematic:</strong> /{sortedData[0]?.phoneme}/ (
                {sortedData[0]?.misspellings} errors)
              </p>
            </div> */}
        </>
      )}
    </CardContent>
  );
};

export default PhonemeContent;
