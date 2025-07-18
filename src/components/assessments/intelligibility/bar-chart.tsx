import { Badge } from "@/components/ui/badge";
import { PhonemeData } from "@/types";
import React from "react";

interface BarChartProps {
  item: PhonemeData;
  index: number;
  animatedData: PhonemeData[];
  getBarColor: (index: number) => string;
  getBarHeight: (misspellings: number) => number;
}

const BarChart = ({
  item,
  index,
  animatedData,
  getBarColor,
  getBarHeight,
}: BarChartProps) => {
  return (
    <div key={item.phoneme} className="flex flex-col items-center space-y-2">
      {/* Bar */}
      <div className="relative flex items-end" style={{ height: "200px" }}>
        <div
          className={`${getBarColor(
            index
          )} transition-all duration-700 ease-out rounded-t-md min-w-[24px] flex items-end justify-center`}
          style={{
            height: `${
              animatedData.find((d) => d.phoneme === item.phoneme)
                ? getBarHeight(item.count)
                : 0
            }%`,
            width: "32px",
          }}
        >
          {/* Count label on top of bar */}
          {animatedData.find((d) => d.phoneme === item.phoneme) && (
            <span className="text-xs font-semibold text-white mb-1">
              {item.count}
            </span>
          )}
        </div>
      </div>

      {/* Phoneme label */}
      <div className="text-center">
        <Badge variant="outline" className="text-xs font-mono">
          /{item.phoneme}/
        </Badge>
      </div>
    </div>
  );
};

export default BarChart;
