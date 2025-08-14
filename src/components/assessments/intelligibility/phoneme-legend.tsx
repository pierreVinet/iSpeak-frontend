import { PhonemeData } from "@/types";
import React from "react";

interface PhonemeLegendProps {
  sortedData: PhonemeData[];
  getBarColor: (index: number) => string;
}

const PhonemeLegend = ({ sortedData, getBarColor }: PhonemeLegendProps) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Top Phonemes Errors:</h4>
      <div className="grid grid-cols-2 gap-2">
        {sortedData.slice(0, 6).map((item, index) => (
          <div key={item.phoneme} className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded ${getBarColor(index)}`} />
            <span className="text-sm font-mono">/{item.phoneme}/</span>
            <span className="text-xs text-muted-foreground">
              ({item.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhonemeLegend;
